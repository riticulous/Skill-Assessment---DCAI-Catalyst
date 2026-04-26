from app.models.schemas import (
    Session,
    AssessmentStatus,
    ChatMessage,
    SkillProgressUpdate,
    ReportData,
    SkillScore,
    CodingChallenge,
)
from app.services.llm import chat, structured_output
from app.services.scoring import score_skill, classify_overall, evaluate_code
from app.services.learning_plan import generate_learning_plans
from app.prompts.assessment import (
    ASSESSMENT_SYSTEM_PROMPT,
    ASSESSMENT_OPENING_PROMPT,
    ASSESSMENT_DECISION_PROMPT,
    MCQ_GENERATION_PROMPT,
    TECH_ROLE_DETECTION_PROMPT,
    CODING_QUESTION_PROMPT,
)
import logging

logger = logging.getLogger(__name__)

QUESTIONS_PER_SKILL = 3  # 1 text + 2 MCQs


class AssessmentAgent:
    def __init__(self, session: Session):
        self.session = session
        self.skill_conversation_buffer: list[ChatMessage] = []
        self._current_mcq: dict | None = None
        self._pending_mcq_feedback: str = ""

    def _current_skill(self):
        idx = self.session.current_skill_index
        skills = self.session.skills_to_assess
        if idx < len(skills):
            return skills[idx]
        return None

    def _skills_list_str(self) -> str:
        return ", ".join(s.name for s in self.session.skills_to_assess)

    async def detect_tech_role(self):
        try:
            prompt = TECH_ROLE_DETECTION_PROMPT.format(
                jd_text=self.session.jd_text[:500],
                resume_text=self.session.resume_text[:500],
            )
            result = await structured_output(prompt)
            self.session.is_tech_role = result.get("is_tech_role", False)
            self.session.coding_language = result.get("primary_language", "Python") or "Python"
            logger.info(f"Tech role: {self.session.is_tech_role}, Language: {self.session.coding_language}")
        except Exception as e:
            logger.warning(f"Tech role detection failed: {e}")
            self.session.is_tech_role = False

    async def get_opening_message(self) -> str:
        skill = self._current_skill()
        if not skill:
            return "No skills to assess. The assessment is complete."

        skill.status = AssessmentStatus.IN_PROGRESS

        prompt = ASSESSMENT_OPENING_PROMPT.format(
            skills_list=self._skills_list_str(),
            first_skill=skill.name,
            resume_context=skill.resume_context or "Not mentioned in resume",
            jd_context=skill.jd_context or "Required by the job description",
        )

        response = await chat([{"role": "user", "content": prompt}])
        self.skill_conversation_buffer.append(ChatMessage(role="assistant", content=response))
        skill.questions_asked += 1
        return response

    async def process_message(self, user_message: str, message_type: str = "text") -> dict:
        """Process user message. Flow per skill: text Q1 → MCQ #1 → MCQ #2 → score."""

        if self.session.coding_phase:
            return await self._handle_code_submission(user_message)

        if message_type == "mcq_answer" and self._current_mcq:
            return await self._handle_mcq_answer(user_message)

        skill = self._current_skill()
        if not skill:
            if self.session.is_tech_role and not self.session.coding_phase:
                return await self._start_coding_phase()
            return {"type": "text", "content": "The assessment is now complete! You can view your report."}

        self.skill_conversation_buffer.append(ChatMessage(role="user", content=user_message))

        # After text Q1 answer (questions_asked == 1) → generate MCQ #1
        if skill.questions_asked >= 1:
            return await self._generate_mcq_question(skill)

        # Fallback: generate text followup (shouldn't normally happen)
        response = await self._generate_response(skill, is_transition=False)
        self.skill_conversation_buffer.append(ChatMessage(role="assistant", content=response))
        skill.questions_asked += 1
        return {"type": "text", "content": response}

    async def _generate_mcq_question(self, skill, prefix_text: str = "") -> dict:
        convo_text = "\n".join(
            f"{'Assessor' if m.role == 'assistant' else 'Candidate'}: {m.content}"
            for m in self.skill_conversation_buffer
        )

        prompt = MCQ_GENERATION_PROMPT.format(
            skill_name=skill.name,
            resume_context=skill.resume_context or "Not mentioned in resume",
            jd_context=skill.jd_context or "Required by the job description",
            conversation=convo_text,
        )

        try:
            mcq_data = await structured_output(prompt)
            self._current_mcq = mcq_data
            self._pending_mcq_feedback = ""

            mcq_text = f"[MCQ] {mcq_data['question']}\n"
            for opt in mcq_data.get("options", []):
                mcq_text += f"  {opt['id']}) {opt['text']}\n"

            self.skill_conversation_buffer.append(
                ChatMessage(role="assistant", content=mcq_text, message_type="mcq")
            )
            skill.questions_asked += 1

            result = {
                "type": "mcq",
                "content": mcq_text,
                "mcq_data": {
                    "question": mcq_data["question"],
                    "options": mcq_data.get("options", []),
                },
            }
            if prefix_text:
                result["transition_text"] = prefix_text
            return result
        except Exception as e:
            logger.warning(f"MCQ generation failed, falling back to text: {e}")
            response = await self._generate_response(skill, is_transition=False)
            self.skill_conversation_buffer.append(ChatMessage(role="assistant", content=response))
            skill.questions_asked += 1
            full = f"{prefix_text}\n\n{response}" if prefix_text else response
            return {"type": "text", "content": full}

    async def _handle_mcq_answer(self, selected_option: str) -> dict:
        skill = self._current_skill()
        mcq = self._current_mcq

        if not skill or not mcq:
            return {"type": "text", "content": "Something went wrong. Let's continue."}

        correct = mcq.get("correct", "")
        selected_text = ""
        for opt in mcq.get("options", []):
            if opt["id"] == selected_option:
                selected_text = opt["text"]
                break

        is_correct = selected_option.upper() == correct.upper()

        answer_text = f"Selected: {selected_option}) {selected_text}"
        self.skill_conversation_buffer.append(
            ChatMessage(role="user", content=answer_text, message_type="mcq_answer")
        )

        if is_correct:
            feedback = f"That's correct! {mcq.get('explanation', '')}"
        else:
            correct_text = ""
            for opt in mcq.get("options", []):
                if opt["id"] == correct:
                    correct_text = opt["text"]
                    break
            feedback = f"The correct answer was {correct}) {correct_text}. {mcq.get('explanation', '')}"

        self.skill_conversation_buffer.append(
            ChatMessage(role="assistant", content=feedback)
        )
        self._current_mcq = None

        # If only 2 questions done (text + MCQ#1), generate MCQ #2
        if skill.questions_asked < QUESTIONS_PER_SKILL:
            return await self._generate_mcq_question(skill, prefix_text=feedback)

        # All 3 questions done (text + MCQ#1 + MCQ#2) → score and advance
        return await self._score_and_advance(skill, extra_text=feedback)

    async def _score_and_advance(self, skill, extra_text: str = "") -> dict:
        score = await score_skill(skill.name, self.skill_conversation_buffer)
        skill.score = score
        skill.status = AssessmentStatus.ASSESSED

        self.session.current_skill_index += 1
        self.skill_conversation_buffer = []

        next_skill = self._current_skill()
        if next_skill:
            next_skill.status = AssessmentStatus.IN_PROGRESS
            response = await self._generate_response(next_skill, is_transition=True)
            self.skill_conversation_buffer.append(ChatMessage(role="assistant", content=response))
            next_skill.questions_asked += 1
            full_text = f"{extra_text}\n\n{response}" if extra_text else response
            return {"type": "text", "content": full_text}
        else:
            if self.session.is_tech_role:
                transition = extra_text + "\n\n" if extra_text else ""
                coding_result = await self._start_coding_phase()
                if coding_result["type"] == "coding":
                    coding_result["transition_text"] = transition + "Great work on the skill questions! Now let's move on to a coding challenge."
                return coding_result
            closing = await self._generate_closing()
            full_text = f"{extra_text}\n\n{closing}" if extra_text else closing
            return {"type": "text", "content": full_text}

    async def _start_coding_phase(self) -> dict:
        self.session.coding_phase = True

        for attempt in range(2):
            try:
                prompt = CODING_QUESTION_PROMPT.format(
                    language=self.session.coding_language,
                    jd_context=self.session.jd_text[:300],
                    skills_list=self._skills_list_str(),
                )

                coding_data = await structured_output(prompt)
                challenge = CodingChallenge(
                    title=coding_data.get("title", "Coding Challenge"),
                    description=coding_data.get("description", ""),
                    language=coding_data.get("language", self.session.coding_language),
                    starter_code=coding_data.get("starter_code", ""),
                    examples=coding_data.get("examples", []),
                    hints=coding_data.get("hints", []),
                    expected_approach=coding_data.get("expected_approach", ""),
                    time_complexity=coding_data.get("time_complexity", ""),
                    space_complexity=coding_data.get("space_complexity", ""),
                )
                self.session.coding_challenge = challenge

                coding_text = f"[CODING CHALLENGE] {challenge.title}\n\n{challenge.description}"
                self.skill_conversation_buffer.append(
                    ChatMessage(role="assistant", content=coding_text, message_type="coding")
                )

                return {
                    "type": "coding",
                    "content": coding_text,
                    "coding_data": {
                        "title": challenge.title,
                        "description": challenge.description,
                        "language": challenge.language,
                        "starter_code": challenge.starter_code,
                        "examples": challenge.examples,
                        "hints": challenge.hints,
                    },
                }
            except Exception as e:
                logger.warning(f"Coding question generation attempt {attempt + 1} failed: {e}")
                if attempt == 0:
                    continue

        logger.error("Coding question generation failed after retries, skipping coding phase")
        self.session.coding_phase = False
        closing = await self._generate_closing()
        return {"type": "text", "content": closing}

    async def _handle_code_submission(self, code: str) -> dict:
        challenge = self.session.coding_challenge

        self.skill_conversation_buffer.append(
            ChatMessage(role="user", content=f"```{self.session.coding_language}\n{code}\n```", message_type="code_answer")
        )

        if challenge:
            code_score = await evaluate_code(
                problem_title=challenge.title,
                problem_description=challenge.description,
                language=challenge.language,
                expected_approach=challenge.expected_approach,
                time_complexity=challenge.time_complexity,
                submitted_code=code,
            )
            self.session.coding_score = code_score

            feedback = (
                f"Thanks for your solution! {code_score.evidence}\n\n"
                f"That wraps up our assessment! Your detailed report and personalized "
                f"learning plan are being generated now. You'll see them in just a moment!"
            )
        else:
            feedback = await self._generate_closing()

        self.session.coding_phase = False
        return {"type": "text", "content": feedback}

    async def _decide_next_action(self, skill_name: str, questions_asked: int, latest_response: str) -> dict:
        if questions_asked >= QUESTIONS_PER_SKILL:
            return {"action": "move_to_next_skill", "reasoning": "Maximum questions reached"}

        is_last = self.session.current_skill_index >= len(self.session.skills_to_assess) - 1

        prompt = ASSESSMENT_DECISION_PROMPT.format(
            current_skill=skill_name,
            questions_asked=questions_asked,
            latest_response=latest_response,
        )

        try:
            result = await structured_output(prompt)
            if is_last and result.get("action") == "move_to_next_skill":
                result["action"] = "end_assessment"
            return result
        except Exception:
            if questions_asked >= 2:
                return {"action": "move_to_next_skill" if not is_last else "end_assessment"}
            return {"action": "ask_followup"}

    async def _generate_response(self, skill, is_transition: bool) -> str:
        system = ASSESSMENT_SYSTEM_PROMPT.format(
            skills_list=self._skills_list_str(),
            current_skill=skill.name,
            resume_context=skill.resume_context or "Not mentioned in resume",
            jd_context=skill.jd_context or "Required by the job description",
            questions_asked=skill.questions_asked,
        )

        messages = [
            {"role": m.role, "content": m.content}
            for m in self.session.conversation_history
        ]

        if is_transition:
            messages.append({
                "role": "user",
                "content": f"[SYSTEM: The candidate has finished answering about the previous skill. Now smoothly transition to asking about {skill.name}. Ask a practical, scenario-based question.]",
            })

        return await chat(messages, system_prompt=system)

    async def _generate_closing(self) -> str:
        return (
            "That wraps up our assessment! Thank you so much for taking the time to walk me through your experience — "
            "I really enjoyed our conversation. Your detailed report and personalized learning plan are being generated now. "
            "You'll be able to view them in just a moment!"
        )

    def is_assessment_complete(self) -> bool:
        skills_done = self.session.current_skill_index >= len(self.session.skills_to_assess)
        if not skills_done:
            return False
        if self.session.coding_phase:
            return False
        return True

    def get_progress(self) -> SkillProgressUpdate:
        current = self._current_skill()
        completed = sum(1 for s in self.session.skills_to_assess if s.status == AssessmentStatus.ASSESSED)
        return SkillProgressUpdate(
            skills=self.session.skills_to_assess,
            current_skill=current.name if current else ("Coding Challenge" if self.session.coding_phase else None),
            completed_count=completed,
            total_count=len(self.session.skills_to_assess),
        )

    async def generate_report(self) -> ReportData:
        scores = [s.score for s in self.session.skills_to_assess if s.score is not None]

        all_scores = list(scores)
        if self.session.coding_score:
            all_scores.append(self.session.coding_score)

        if all_scores:
            total = sum(s.score for s in all_scores)
            max_total = sum(s.max_score for s in all_scores)
            percentage = (total / max_total) * 100 if max_total > 0 else 0
        else:
            percentage = 0

        learning_plans = await generate_learning_plans(scores, self.session.jd_text[:200])
        total_hours = sum(p.estimated_hours for p in learning_plans)

        return ReportData(
            session_id=self.session.id,
            role_title=self.session.jd_text[:100].strip(),
            overall_score=sum(s.score for s in all_scores) if all_scores else 0,
            overall_percentage=round(percentage, 1),
            classification=classify_overall(percentage),
            skill_scores=all_scores,
            learning_plans=learning_plans,
            assessed_skills=self.session.skills_to_assess,
            total_learning_hours=total_hours,
        )
