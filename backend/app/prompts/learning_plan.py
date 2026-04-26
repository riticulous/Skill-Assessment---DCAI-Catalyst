LEARNING_PLAN_PROMPT = """You are an expert career coach and learning path designer. Based on a candidate's skill assessment results, generate a personalized learning plan.

Candidate's existing strong skills (scored 7+):
{strong_skills}

Skills that need improvement (with scores):
{weak_skills}

Job role they're targeting: {role_title}

For EACH skill that needs improvement, generate a learning plan entry. Return ONLY a valid JSON array.

For each entry:
{{
  "skill": "<skill name>",
  "current_level": "<beginner|intermediate|advanced>",
  "target_level": "<intermediate|advanced|expert>",
  "is_adjacent": <true if this skill is closely related to one of their strong skills>,
  "adjacency_reason": "<if adjacent, explain why it's faster to learn given their existing skills>",
  "estimated_hours": <realistic number>,
  "priority": "<high|medium|low>",
  "resources": [
    {{
      "type": "<course|book|tutorial|practice|documentation|video>",
      "title": "<specific, real resource name>",
      "url": "<real URL if known, empty string if unsure>",
      "format": "<video course|book|interactive|article|project>",
      "estimated_hours": <hours for this resource>,
      "why": "<why this resource specifically, given their background>"
    }}
  ],
  "milestones": [
    {{"week": 1, "goal": "<specific achievable goal>"}},
    {{"week": 2, "goal": "<builds on week 1>"}},
    {{"week": 3, "goal": "<assessment-ready level>"}}
  ]
}}

RULES:
- Recommend 2-4 resources per skill (mix of free and paid)
- Resources should be REAL and well-known (Udemy, Coursera, YouTube channels, official docs, books)
- Time estimates should be realistic (not optimistic)
- Adjacent skills should have shorter timelines (explain why)
- Priority: "high" for must-have skills with low scores, "medium" for nice-to-haves, "low" for extras
- Milestones should be specific and achievable, not vague
- Consider the candidate's existing strengths when recommending learning paths

Return ONLY the JSON array. No markdown, no explanation."""
