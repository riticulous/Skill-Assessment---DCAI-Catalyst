JD_SKILL_EXTRACTION_PROMPT = """You are an expert HR analyst. Extract all technical and professional skills from this Job Description.

For each skill, provide:
- name: the skill name (concise, e.g. "React", "System Design", "Team Leadership")
- category: one of "technical", "soft_skill", "domain_knowledge", "tool"
- importance: "must_have" or "nice_to_have"
- context: brief note on how it's mentioned in the JD (1 sentence)

Return ONLY a valid JSON array. No markdown, no explanation.

Example format:
[
  {{"name": "React", "category": "technical", "importance": "must_have", "context": "Required for building frontend components"}},
  {{"name": "Communication", "category": "soft_skill", "importance": "nice_to_have", "context": "Mentioned as preferred for cross-team collaboration"}}
]

Job Description:
{jd_text}
"""

RESUME_SKILL_EXTRACTION_PROMPT = """You are an expert resume analyst. Extract all technical and professional skills from this resume.

For each skill, provide:
- name: the skill name (concise, e.g. "React", "Python", "Project Management")
- category: one of "technical", "soft_skill", "domain_knowledge", "tool"
- experience_hint: brief indicator of experience level based on context (e.g. "3 years", "used in 2 projects", "certified")
- context: how the skill appears in the resume (1 sentence)

Return ONLY a valid JSON array. No markdown, no explanation.

Example format:
[
  {{"name": "Python", "category": "technical", "experience_hint": "5 years, primary language", "context": "Used across all listed projects for backend development"}},
  {{"name": "AWS", "category": "tool", "experience_hint": "2 years", "context": "Deployed microservices on EC2 and Lambda"}}
]

Resume:
{resume_text}
"""

SKILL_GAP_ANALYSIS_PROMPT = """You are an expert skill gap analyst. Given the skills required by a Job Description and the skills claimed in a candidate's resume, produce a gap analysis.

For each JD-required skill, determine:
- If the candidate has a matching skill (even if named slightly differently, e.g. "JS" matches "JavaScript")
- The match_type: "matched" (in both), "gap" (required but not in resume), or "extra" (in resume, not required)

Return a JSON array of skills to assess, prioritized:
1. First: "matched" skills (must_have first, then nice_to_have) — we need to verify depth
2. Then: "gap" skills (must_have first) — we need to check if they have hidden knowledge
3. Limit to the top 8 most important skills

For each skill:
- name: skill name
- category: "technical" | "soft_skill" | "domain_knowledge" | "tool"
- importance: "must_have" | "nice_to_have"
- match_type: "matched" | "gap"
- jd_context: what the JD says about this skill
- resume_context: what the resume says (or "Not mentioned in resume" for gaps)

Return ONLY a valid JSON array. No markdown, no explanation.

JD Skills:
{jd_skills}

Resume Skills:
{resume_skills}
"""
