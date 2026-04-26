import logging
from app.services.llm import structured_output
from app.models.schemas import SkillScore, ProficiencyLevel, ChatMessage
from app.prompts.assessment import SCORE_EXTRACTION_PROMPT, CODE_EVALUATION_PROMPT

logger = logging.getLogger(__name__)


async def score_skill(
    skill_name: str,
    conversation_excerpt: list[ChatMessage],
) -> SkillScore:
    convo_text = "\n".join(
        f"{'Assessor' if m.role == 'assistant' else 'Candidate'}: {m.content}"
        for m in conversation_excerpt
    )

    prompt = SCORE_EXTRACTION_PROMPT.format(
        skill_name=skill_name,
        conversation=convo_text,
    )

    raw = await structured_output(prompt)

    level_map = {
        "beginner": ProficiencyLevel.BEGINNER,
        "intermediate": ProficiencyLevel.INTERMEDIATE,
        "advanced": ProficiencyLevel.ADVANCED,
        "expert": ProficiencyLevel.EXPERT,
    }

    return SkillScore(
        skill=raw.get("skill", skill_name),
        score=max(1, min(10, int(raw.get("score", 5)))),
        proficiency_level=level_map.get(raw.get("proficiency_level", "beginner"), ProficiencyLevel.BEGINNER),
        evidence=raw.get("evidence", ""),
        strengths=raw.get("strengths", []),
        gaps=raw.get("gaps", []),
    )


async def evaluate_code(
    problem_title: str,
    problem_description: str,
    language: str,
    expected_approach: str,
    time_complexity: str,
    submitted_code: str,
) -> SkillScore:
    prompt = CODE_EVALUATION_PROMPT.format(
        problem_title=problem_title,
        problem_description=problem_description,
        language=language,
        expected_approach=expected_approach,
        time_complexity=time_complexity,
        submitted_code=submitted_code,
    )

    try:
        raw = await structured_output(prompt)
    except Exception as e:
        logger.error(f"Code evaluation failed: {e}")
        raw = {"score": 5, "feedback": "Could not fully evaluate the submission."}

    level_map = {
        "optimal": ProficiencyLevel.EXPERT,
        "acceptable": ProficiencyLevel.ADVANCED,
        "suboptimal": ProficiencyLevel.INTERMEDIATE,
        "wrong": ProficiencyLevel.BEGINNER,
    }

    return SkillScore(
        skill=f"Coding Challenge ({language})",
        score=max(1, min(10, int(raw.get("score", 5)))),
        proficiency_level=level_map.get(raw.get("approach_quality", "acceptable"), ProficiencyLevel.INTERMEDIATE),
        evidence=raw.get("feedback", ""),
        strengths=raw.get("strengths", []),
        gaps=raw.get("issues", []),
    )


def classify_overall(percentage: float) -> str:
    if percentage >= 80:
        return "Strong Match"
    if percentage >= 60:
        return "Good Match with Gaps"
    if percentage >= 40:
        return "Needs Development"
    return "Significant Gaps"
