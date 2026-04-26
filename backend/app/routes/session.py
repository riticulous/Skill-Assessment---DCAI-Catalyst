from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.models.schemas import SessionResponse, Session, AssessedSkill, AssessmentStatus
from app.services.resume_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_jd_skills, extract_resume_skills, compute_skill_gap
from app.services import db
from app.middleware.auth import get_current_user

router = APIRouter()

# In-memory cache so AssessmentAgent can work during a live session
sessions: dict[str, Session] = {}


def get_sessions() -> dict[str, Session]:
    return sessions


@router.post("/session", response_model=SessionResponse)
async def create_session(
    jd_text: str = Form(...),
    resume: UploadFile = File(...),
    title: str = Form(""),
    user_id: str = Depends(get_current_user),
):
    resume_bytes = await resume.read()
    resume_text = extract_text_from_pdf(resume_bytes)

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF. Try pasting your resume as text.")

    jd_skills = await extract_jd_skills(jd_text)
    resume_skills = await extract_resume_skills(resume_text)
    skill_gaps = await compute_skill_gap(jd_skills, resume_skills)

    assessed_skills = [
        AssessedSkill(
            name=gap.name,
            category=gap.category,
            importance=gap.importance,
            match_type=gap.match_type,
            jd_context=gap.jd_context,
            resume_context=gap.resume_context,
            status=AssessmentStatus.PENDING,
        )
        for gap in skill_gaps
    ]

    jd_skills_json = [s.model_dump() for s in jd_skills]
    resume_skills_json = [s.model_dump() for s in resume_skills]
    assessed_skills_json = [s.model_dump() for s in assessed_skills]

    db_session = await db.create_session(
        user_id=user_id,
        jd_text=jd_text,
        resume_text=resume_text,
        jd_skills=jd_skills_json,
        resume_skills=resume_skills_json,
        skills_to_assess=assessed_skills_json,
        title=title,
    )

    session_id = db_session["id"]

    session = Session(
        id=session_id,
        jd_text=jd_text,
        resume_text=resume_text,
        jd_skills=jd_skills,
        resume_skills=resume_skills,
        skills_to_assess=assessed_skills,
    )
    sessions[session_id] = session

    return SessionResponse(
        session_id=session_id,
        skills_to_assess=skill_gaps,
        total_skills=len(skill_gaps),
        message=f"Found {len(skill_gaps)} skills to assess. Ready to start the conversation!",
    )


@router.post("/session/text", response_model=SessionResponse)
async def create_session_text(
    jd_text: str = Form(...),
    resume_text: str = Form(...),
    title: str = Form(""),
    user_id: str = Depends(get_current_user),
):
    """Fallback endpoint when PDF parsing fails — accepts plain text resume."""
    jd_skills = await extract_jd_skills(jd_text)
    resume_skills = await extract_resume_skills(resume_text)
    skill_gaps = await compute_skill_gap(jd_skills, resume_skills)

    assessed_skills = [
        AssessedSkill(
            name=gap.name,
            category=gap.category,
            importance=gap.importance,
            match_type=gap.match_type,
            jd_context=gap.jd_context,
            resume_context=gap.resume_context,
            status=AssessmentStatus.PENDING,
        )
        for gap in skill_gaps
    ]

    jd_skills_json = [s.model_dump() for s in jd_skills]
    resume_skills_json = [s.model_dump() for s in resume_skills]
    assessed_skills_json = [s.model_dump() for s in assessed_skills]

    db_session = await db.create_session(
        user_id=user_id,
        jd_text=jd_text,
        resume_text=resume_text,
        jd_skills=jd_skills_json,
        resume_skills=resume_skills_json,
        skills_to_assess=assessed_skills_json,
        title=title,
    )

    session_id = db_session["id"]

    session = Session(
        id=session_id,
        jd_text=jd_text,
        resume_text=resume_text,
        jd_skills=jd_skills,
        resume_skills=resume_skills,
        skills_to_assess=assessed_skills,
    )
    sessions[session_id] = session

    return SessionResponse(
        session_id=session_id,
        skills_to_assess=skill_gaps,
        total_skills=len(skill_gaps),
        message=f"Found {len(skill_gaps)} skills to assess. Ready to start the conversation!",
    )
