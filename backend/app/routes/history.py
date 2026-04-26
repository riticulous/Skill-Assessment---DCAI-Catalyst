from fastapi import APIRouter, Depends, HTTPException
from app.services import db
from app.middleware.auth import get_current_user
from app.routes.session import get_sessions
from app.routes.chat import agents

router = APIRouter()


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, user_id: str = Depends(get_current_user)):
    deleted = await db.delete_session(session_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")

    get_sessions().pop(session_id, None)
    agents.pop(session_id, None)

    return {"ok": True}


@router.get("/sessions")
async def list_sessions(user_id: str = Depends(get_current_user)):
    sessions = await db.get_user_sessions(user_id)

    session_ids = [s["id"] for s in sessions]
    reports = await db.get_report_for_session_list(session_ids)

    result = []
    for s in sessions:
        report_info = reports.get(s["id"])
        result.append({
            "id": s["id"],
            "title": s.get("title") or "",
            "jd_snippet": s["jd_text"][:120].strip(),
            "is_complete": s["is_complete"],
            "created_at": s["created_at"],
            "overall_percentage": report_info["overall_percentage"] if report_info else None,
            "classification": report_info["classification"] if report_info else None,
        })

    return result
