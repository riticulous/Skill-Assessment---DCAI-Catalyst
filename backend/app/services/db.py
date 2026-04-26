from supabase import create_client, Client
from app.config import get_settings

_client: Client | None = None


def get_db() -> Client:
    global _client
    if _client is None:
        settings = get_settings()
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client


# ── Sessions ──────────────────────────────────────────────

async def create_session(
    user_id: str,
    jd_text: str,
    resume_text: str,
    jd_skills: list,
    resume_skills: list,
    skills_to_assess: list,
    title: str = "",
) -> dict:
    row = {
        "user_id": user_id,
        "title": title,
        "jd_text": jd_text,
        "resume_text": resume_text,
        "jd_skills": jd_skills,
        "resume_skills": resume_skills,
        "skills_to_assess": skills_to_assess,
    }
    result = get_db().table("sessions").insert(row).execute()
    return result.data[0]


async def get_session(session_id: str) -> dict | None:
    result = get_db().table("sessions").select("*").eq("id", session_id).execute()
    return result.data[0] if result.data else None


async def update_session(session_id: str, data: dict) -> dict | None:
    result = get_db().table("sessions").update(data).eq("id", session_id).execute()
    return result.data[0] if result.data else None


async def delete_session(session_id: str, user_id: str) -> bool:
    result = (
        get_db()
        .table("sessions")
        .delete()
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    return len(result.data) > 0


async def get_user_sessions(user_id: str) -> list[dict]:
    result = (
        get_db()
        .table("sessions")
        .select("id, title, jd_text, is_complete, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


# ── Messages ──────────────────────────────────────────────

async def save_message(session_id: str, role: str, content: str) -> dict:
    row = {"session_id": session_id, "role": role, "content": content}
    result = get_db().table("messages").insert(row).execute()
    return result.data[0]


async def get_messages(session_id: str) -> list[dict]:
    result = (
        get_db()
        .table("messages")
        .select("role, content")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return result.data


# ── Reports ───────────────────────────────────────────────

async def save_report(session_id: str, report_data: dict) -> dict:
    row = {
        "session_id": session_id,
        "overall_score": report_data.get("overall_score", 0),
        "overall_percentage": report_data.get("overall_percentage", 0),
        "classification": report_data.get("classification", ""),
        "skill_scores": report_data.get("skill_scores", []),
        "learning_plans": report_data.get("learning_plans", []),
        "total_learning_hours": report_data.get("total_learning_hours", 0),
    }
    result = get_db().table("reports").insert(row).execute()
    return result.data[0]


async def get_report(session_id: str) -> dict | None:
    result = (
        get_db()
        .table("reports")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )
    return result.data[0] if result.data else None


async def get_report_for_session_list(session_ids: list[str]) -> dict[str, dict]:
    if not session_ids:
        return {}
    result = (
        get_db()
        .table("reports")
        .select("session_id, overall_percentage, classification")
        .in_("session_id", session_ids)
        .execute()
    )
    return {r["session_id"]: r for r in result.data}
