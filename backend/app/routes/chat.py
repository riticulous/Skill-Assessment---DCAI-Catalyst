import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.routes.session import get_sessions
from app.services.assessment import AssessmentAgent
from app.services import db
from app.middleware.auth import verify_token
from app.models.schemas import ChatMessage, Session, AssessedSkill

logger = logging.getLogger(__name__)

router = APIRouter()

agents: dict[str, AssessmentAgent] = {}


async def _rebuild_session_from_db(session_id: str) -> Session | None:
    """Rebuild an in-memory Session from DB if the server restarted."""
    db_session = await db.get_session(session_id)
    if not db_session:
        return None

    assessed_skills = [AssessedSkill(**s) for s in (db_session.get("skills_to_assess") or [])]
    messages = await db.get_messages(session_id)
    history = [ChatMessage(role=m["role"], content=m["content"]) for m in messages]

    session = Session(
        id=session_id,
        jd_text=db_session["jd_text"],
        resume_text=db_session["resume_text"],
        jd_skills=db_session.get("jd_skills", []),
        resume_skills=db_session.get("resume_skills", []),
        skills_to_assess=assessed_skills,
        conversation_history=history,
        current_skill_index=db_session.get("current_skill_index", 0),
        is_complete=db_session.get("is_complete", False),
    )
    return session


@router.websocket("/ws/chat/{session_id}")
async def chat_websocket(websocket: WebSocket, session_id: str):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Missing token")
        return

    try:
        user_id = await verify_token(token)
    except Exception as e:
        logger.error(f"WebSocket auth failed: {e}")
        await websocket.close(code=4001, reason="Invalid token")
        return

    sessions = get_sessions()
    if session_id not in sessions:
        session = await _rebuild_session_from_db(session_id)
        if session:
            sessions[session_id] = session
        else:
            await websocket.close(code=4004, reason="Session not found")
            return

    await websocket.accept()
    session = sessions[session_id]

    if session_id not in agents:
        agents[session_id] = AssessmentAgent(session)

    agent = agents[session_id]

    try:
        if session.conversation_history:
            for msg in session.conversation_history:
                ws_msg = {
                    "type": msg.message_type if msg.message_type != "text" else "message",
                    "role": msg.role,
                    "content": msg.content,
                }
                if msg.message_type == "mcq" and msg.metadata:
                    ws_msg["mcq_data"] = msg.metadata
                elif msg.message_type == "coding" and msg.metadata:
                    ws_msg["coding_data"] = msg.metadata
                await websocket.send_json(ws_msg)
            await _send_progress(websocket, agent)

            if session.is_complete:
                await websocket.send_json({
                    "type": "assessment_complete",
                    "session_id": session_id,
                })
                return
        else:
            await agent.detect_tech_role()

            opening = await agent.get_opening_message()
            session.conversation_history.append(ChatMessage(role="assistant", content=opening))
            await db.save_message(session_id, "assistant", opening)

            await websocket.send_json({
                "type": "message",
                "role": "assistant",
                "content": opening,
            })
            await _send_progress(websocket, agent)

        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            msg_type = payload.get("type", "text")
            user_message = payload.get("message", "")

            if not user_message.strip():
                continue

            if msg_type == "mcq_answer":
                history_content = f"Selected option: {user_message}"
            elif msg_type == "code_answer":
                history_content = f"```\n{user_message}\n```"
            else:
                history_content = user_message

            session.conversation_history.append(
                ChatMessage(role="user", content=history_content, message_type=msg_type)
            )
            await db.save_message(session_id, "user", history_content)

            result = await agent.process_message(user_message, message_type=msg_type)

            response_type = result.get("type", "text")
            response_content = result.get("content", "")

            if response_type == "mcq":
                mcq_data = result.get("mcq_data", {})
                msg_obj = ChatMessage(
                    role="assistant",
                    content=response_content,
                    message_type="mcq",
                    metadata=mcq_data,
                )
                session.conversation_history.append(msg_obj)
                await db.save_message(session_id, "assistant", response_content)

                transition = result.get("transition_text", "")
                if transition:
                    await websocket.send_json({
                        "type": "message",
                        "role": "assistant",
                        "content": transition,
                    })

                await websocket.send_json({
                    "type": "mcq",
                    "role": "assistant",
                    "content": response_content,
                    "mcq_data": mcq_data,
                })

            elif response_type == "coding":
                coding_data = result.get("coding_data", {})
                msg_obj = ChatMessage(
                    role="assistant",
                    content=response_content,
                    message_type="coding",
                    metadata=coding_data,
                )
                session.conversation_history.append(msg_obj)
                await db.save_message(session_id, "assistant", response_content)

                transition = result.get("transition_text", "")
                if transition:
                    await websocket.send_json({
                        "type": "message",
                        "role": "assistant",
                        "content": transition,
                    })

                await websocket.send_json({
                    "type": "coding",
                    "role": "assistant",
                    "content": response_content,
                    "coding_data": coding_data,
                })

            else:
                session.conversation_history.append(
                    ChatMessage(role="assistant", content=response_content)
                )
                await db.save_message(session_id, "assistant", response_content)

                await websocket.send_json({
                    "type": "message",
                    "role": "assistant",
                    "content": response_content,
                })

            await _send_progress(websocket, agent)

            if agent.is_assessment_complete():
                report = await agent.generate_report()
                session.report = report
                session.is_complete = True

                report_dict = report.model_dump()
                await db.save_report(session_id, report_dict)
                await db.update_session(session_id, {
                    "is_complete": True,
                    "current_skill_index": session.current_skill_index,
                    "skills_to_assess": [s.model_dump() for s in session.skills_to_assess],
                })

                await websocket.send_json({
                    "type": "assessment_complete",
                    "session_id": session_id,
                })
                break

    except WebSocketDisconnect:
        await db.update_session(session_id, {
            "current_skill_index": session.current_skill_index,
            "skills_to_assess": [s.model_dump() for s in session.skills_to_assess],
        })
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {e}")
        try:
            await websocket.send_json({"type": "error", "content": str(e)})
        except Exception:
            pass


async def _send_progress(websocket: WebSocket, agent: AssessmentAgent):
    progress = agent.get_progress()
    await websocket.send_json({
        "type": "progress",
        "skills": [s.model_dump() for s in progress.skills],
        "current_skill": progress.current_skill,
        "completed_count": progress.completed_count,
        "total_count": progress.total_count,
        "coding_phase": agent.session.coding_phase,
        "is_tech_role": agent.session.is_tech_role,
        "coding_language": agent.session.coding_language,
    })
