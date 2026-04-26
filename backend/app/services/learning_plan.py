import json
from app.services.llm import structured_output
from app.models.schemas import (
    SkillScore,
    SkillLearningPlan,
    Resource,
    Milestone,
    ProficiencyLevel,
)
from app.prompts.learning_plan import LEARNING_PLAN_PROMPT


async def generate_learning_plans(
    skill_scores: list[SkillScore],
    role_title: str = "",
) -> list[SkillLearningPlan]:
    strong = [s for s in skill_scores if s.score >= 7]
    weak = [s for s in skill_scores if s.score < 7]

    if not weak:
        return []

    strong_text = json.dumps(
        [{"skill": s.skill, "score": s.score, "strengths": s.strengths} for s in strong],
        indent=2,
    )
    weak_text = json.dumps(
        [{"skill": s.skill, "score": s.score, "level": s.proficiency_level.value, "gaps": s.gaps} for s in weak],
        indent=2,
    )

    prompt = LEARNING_PLAN_PROMPT.format(
        strong_skills=strong_text,
        weak_skills=weak_text,
        role_title=role_title or "the target role",
    )

    raw = await structured_output(prompt)

    level_map = {
        "beginner": ProficiencyLevel.BEGINNER,
        "intermediate": ProficiencyLevel.INTERMEDIATE,
        "advanced": ProficiencyLevel.ADVANCED,
        "expert": ProficiencyLevel.EXPERT,
    }

    plans = []
    for item in raw:
        try:
            resources = [Resource(**r) for r in item.get("resources", [])]
            milestones = [Milestone(**m) for m in item.get("milestones", [])]

            plan = SkillLearningPlan(
                skill=item["skill"],
                current_level=level_map.get(item.get("current_level", "beginner"), ProficiencyLevel.BEGINNER),
                target_level=level_map.get(item.get("target_level", "intermediate"), ProficiencyLevel.INTERMEDIATE),
                is_adjacent=item.get("is_adjacent", False),
                adjacency_reason=item.get("adjacency_reason", ""),
                estimated_hours=item.get("estimated_hours", 0),
                priority=item.get("priority", "medium"),
                resources=resources,
                milestones=milestones,
            )
            plans.append(plan)
        except Exception:
            continue

    return plans
