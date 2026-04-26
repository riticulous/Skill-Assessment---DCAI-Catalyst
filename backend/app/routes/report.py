from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ReportData
from app.services import db
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/report/{session_id}", response_model=ReportData)
async def get_report(session_id: str, user_id: str = Depends(get_current_user)):
    db_session = await db.get_session(session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    if db_session["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    db_report = await db.get_report(session_id)
    if not db_report:
        raise HTTPException(status_code=400, detail="Assessment not yet complete")

    return ReportData(
        session_id=session_id,
        role_title=db_session.get("title") or db_session["jd_text"][:100].strip(),
        overall_score=db_report.get("overall_score", 0),
        overall_percentage=db_report.get("overall_percentage", 0),
        classification=db_report.get("classification", ""),
        skill_scores=db_report.get("skill_scores", []),
        learning_plans=db_report.get("learning_plans", []),
        assessed_skills=db_session.get("skills_to_assess", []),
        total_learning_hours=db_report.get("total_learning_hours", 0),
    )
