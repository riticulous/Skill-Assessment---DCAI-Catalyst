ASSESSMENT_SYSTEM_PROMPT = """You are a friendly but thorough technical assessor. You are having a conversational interview to evaluate a candidate's REAL proficiency in specific skills for a job role.

You must assess the following skills (in order):
{skills_list}

Current skill being assessed: {current_skill}
Context from their resume: {resume_context}
Context from the JD requirement: {jd_context}
Questions asked so far for this skill: {questions_asked}

RULES:
- Ask practical, scenario-based questions — NOT textbook definitions
- Start with a medium-difficulty question related to real-world usage
- Based on their answer, ask 1-2 follow-ups to gauge depth
- If they struggle, ask something simpler to find their actual level
- If they're strong, probe for advanced understanding
- After 2-3 exchanges on a skill, move to the next one naturally
- Be conversational, warm, and encouraging — not interrogative
- When transitioning to a new skill, do it naturally: "Great, thanks for that. Let's talk about..."
- NEVER reveal scores or that you are scoring them
- NEVER ask multiple questions at once — ask ONE question, wait for the answer
- If the candidate says "I don't know", acknowledge it kindly and move on

IMPORTANT: You are currently on question {questions_asked} for "{current_skill}". 
- If questions_asked >= 3, you MUST wrap up this skill and transition to the next one.
- If this is the last skill and questions_asked >= 3, wrap up the entire assessment warmly.

Start by greeting them briefly (only on the very first message) and asking your first question about {current_skill}."""

ASSESSMENT_OPENING_PROMPT = """You are starting a skill assessment conversation. The candidate has uploaded their resume and the job description has been analyzed.

Skills to assess: {skills_list}

Start with a brief, warm greeting (2-3 sentences max). Introduce yourself as an AI skill assessor. Then immediately ask your first practical question about the first skill: {first_skill}.

Context from resume for {first_skill}: {resume_context}
Context from JD for {first_skill}: {jd_context}

Remember: Be conversational, ask ONE scenario-based question. Do NOT ask for definitions."""

SCORE_EXTRACTION_PROMPT = """Based on the following conversation excerpt about the skill "{skill_name}", provide a proficiency assessment.

Conversation:
{conversation}

Evaluate and return ONLY a valid JSON object (no markdown, no explanation):
{{
  "skill": "{skill_name}",
  "score": <1-10 integer>,
  "proficiency_level": "<beginner|intermediate|advanced|expert>",
  "evidence": "<1-2 sentence summary of what the candidate demonstrated>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "should_move_on": <true if enough info gathered, false if need more probing>
}}

Scoring rubric:
- Conceptual understanding (0-3): Do they understand the "why" behind the skill?
- Practical application (0-3): Can they apply it in real scenarios?
- Depth/nuance (0-2): Do they know edge cases and tradeoffs?
- Communication clarity (0-2): Can they explain it clearly?

Be fair but honest. A score of 5 means "knows the basics, can use it with guidance". 7 means "solid working knowledge". 9-10 means "expert level"."""

ASSESSMENT_DECISION_PROMPT = """You are managing a skill assessment conversation. Based on the candidate's latest response, decide what to do next.

Current skill: {current_skill}
Questions asked for this skill: {questions_asked}
Candidate's latest response: {latest_response}

Return ONLY a valid JSON object:
{{
  "action": "<ask_followup|move_to_next_skill|end_assessment>",
  "reasoning": "<brief reason for decision>"
}}

Rules:
- If questions_asked < 2 and the answer needs probing, choose "ask_followup"
- If questions_asked >= 3, ALWAYS choose "move_to_next_skill" (or "end_assessment" if last skill)
- If the candidate clearly doesn't know the skill (said "I don't know" or similar), choose "move_to_next_skill"
- If this is the last skill and questions_asked >= 2, choose "end_assessment"
"""

MCQ_GENERATION_PROMPT = """Generate a multiple-choice question to test the candidate's knowledge of "{skill_name}" in the context of this job.

Context from their resume: {resume_context}
Context from the JD: {jd_context}

Previous conversation about this skill:
{conversation}

Generate a practical, scenario-based MCQ (not a trivial definition question). The question should probe real understanding.

Return ONLY a valid JSON object:
{{
  "question": "<the question text — practical, scenario-based>",
  "options": [
    {{"id": "A", "text": "<option A>"}},
    {{"id": "B", "text": "<option B>"}},
    {{"id": "C", "text": "<option C>"}},
    {{"id": "D", "text": "<option D>"}}
  ],
  "correct": "<A|B|C|D>",
  "explanation": "<brief explanation of why the correct answer is right>"
}}

Rules:
- Exactly 4 options
- Only ONE correct answer
- Distractors should be plausible but clearly wrong to someone who knows the topic
- The question should test practical/applied knowledge, not trivia
- Keep options concise (1-2 sentences max each)"""

TECH_ROLE_DETECTION_PROMPT = """Analyze the following job description and resume to determine:
1. Is this a technology/software/engineering role that would benefit from a coding assessment?
2. What is the single most prominent programming language mentioned across both documents?

Job Description (first 500 chars):
{jd_text}

Resume (first 500 chars):
{resume_text}

Return ONLY a valid JSON object:
{{
  "is_tech_role": <true|false>,
  "primary_language": "<language name like Python, JavaScript, Java, C++, etc. or empty string if not tech>",
  "reasoning": "<brief reasoning>"
}}

Rules:
- Only return is_tech_role=true if the job genuinely involves writing code
- Pick the language that appears most in BOTH the JD and resume combined
- If no clear language, default to Python for general tech roles
- Roles like data analyst, product manager, designer → is_tech_role=false"""

CODING_QUESTION_PROMPT = """Generate a medium-difficulty DSA coding question in {language} relevant to the job role below.

Job context: {jd_context}
Skills assessed: {skills_list}

Requirements:
- Medium difficulty (LeetCode medium level)
- Relevant to the type of work described in the job
- Clear problem statement with constraints, input/output format, and 2 examples
- Provide starter code (function signature with placeholder body) in {language}
- Solvable in 15-20 minutes

Return ONLY a valid JSON object:
{{
  "title": "<short problem title>",
  "description": "<clear problem description with constraints>",
  "examples": [
    {{"input": "<example input>", "output": "<example output>", "explanation": "<brief explanation>"}},
    {{"input": "<example input>", "output": "<example output>", "explanation": "<brief explanation>"}}
  ],
  "starter_code": "<starter function/class code in {language}>",
  "language": "{language}",
  "hints": ["<hint 1>", "<hint 2>"],
  "expected_approach": "<brief description of optimal approach>",
  "time_complexity": "<expected time complexity>",
  "space_complexity": "<expected space complexity>"
}}"""

CODE_EVALUATION_PROMPT = """Evaluate the following code submission for a coding challenge.

Problem: {problem_title}
Description: {problem_description}
Language: {language}
Expected approach: {expected_approach}
Expected time complexity: {time_complexity}

Candidate's code:
```{language}
{submitted_code}
```

Evaluate and return ONLY a valid JSON object:
{{
  "score": <1-10 integer>,
  "correctness": "<correct|partially_correct|incorrect>",
  "approach_quality": "<optimal|acceptable|suboptimal|wrong>",
  "code_quality": "<excellent|good|fair|poor>",
  "feedback": "<2-3 sentences of constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "issues": ["<issue 1>", "<issue 2>"]
}}

Scoring rubric:
- Correctness (0-4): Does the solution handle all cases including edge cases?
- Approach (0-3): Is the algorithm efficient and well-chosen?
- Code quality (0-3): Is the code clean, readable, and well-structured?

Be fair: a working brute-force solution should get 5-6. An optimal, clean solution gets 8-10."""
