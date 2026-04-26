import json
from app.services.llm import structured_output
from app.models.schemas import JDSkill, ResumeSkill, SkillGapItem
from app.prompts.extraction import (
    JD_SKILL_EXTRACTION_PROMPT,
    RESUME_SKILL_EXTRACTION_PROMPT,
    SKILL_GAP_ANALYSIS_PROMPT,
)


def _as_list_of_dicts(raw) -> list[dict]:
    """Normalize structured_output result to a list of dicts."""
    if isinstance(raw, dict):
        for v in raw.values():
            if isinstance(v, list):
                raw = v
                break
        else:
            raw = [raw]

    items = []
    for item in raw:
        if isinstance(item, dict):
            items.append(item)
        elif isinstance(item, str):
            items.append({"name": item, "context": ""})
    return items


async def extract_jd_skills(jd_text: str) -> list[JDSkill]:
    prompt = JD_SKILL_EXTRACTION_PROMPT.format(jd_text=jd_text)
    raw = await structured_output(prompt)
    items = _as_list_of_dicts(raw)

    skills = []
    for item in items:
        try:
            skills.append(JDSkill(**item))
        except Exception:
            skills.append(JDSkill(name=item.get("name", "Unknown"), context=item.get("context", "")))
    return skills


async def extract_resume_skills(resume_text: str) -> list[ResumeSkill]:
    prompt = RESUME_SKILL_EXTRACTION_PROMPT.format(resume_text=resume_text)
    raw = await structured_output(prompt)
    items = _as_list_of_dicts(raw)

    skills = []
    for item in items:
        try:
            skills.append(ResumeSkill(**item))
        except Exception:
            skills.append(ResumeSkill(name=item.get("name", "Unknown"), context=item.get("context", "")))
    return skills


async def compute_skill_gap(
    jd_skills: list[JDSkill],
    resume_skills: list[ResumeSkill],
) -> list[SkillGapItem]:
    jd_data = json.dumps([s.model_dump() for s in jd_skills], indent=2)
    resume_data = json.dumps([s.model_dump() for s in resume_skills], indent=2)

    prompt = SKILL_GAP_ANALYSIS_PROMPT.format(jd_skills=jd_data, resume_skills=resume_data)
    raw = await structured_output(prompt)
    items = _as_list_of_dicts(raw)

    gaps = []
    for item in items:
        try:
            gaps.append(SkillGapItem(**item))
        except Exception:
            gaps.append(SkillGapItem(name=item.get("name", "Unknown")))

    return gaps[:8]
