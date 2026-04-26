from __future__ import annotations

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
import uuid


class SkillCategory(str, Enum):
    TECHNICAL = "technical"
    SOFT_SKILL = "soft_skill"
    DOMAIN_KNOWLEDGE = "domain_knowledge"
    TOOL = "tool"


class SkillImportance(str, Enum):
    MUST_HAVE = "must_have"
    NICE_TO_HAVE = "nice_to_have"


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillMatchType(str, Enum):
    MATCHED = "matched"
    GAP = "gap"
    EXTRA = "extra"


class AssessmentStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    ASSESSED = "assessed"


class JDSkill(BaseModel):
    name: str
    category: SkillCategory = SkillCategory.TECHNICAL
    importance: SkillImportance = SkillImportance.MUST_HAVE
    context: str = ""


class ResumeSkill(BaseModel):
    name: str
    category: SkillCategory = SkillCategory.TECHNICAL
    experience_hint: str = ""
    context: str = ""


class SkillGapItem(BaseModel):
    name: str
    category: SkillCategory = SkillCategory.TECHNICAL
    importance: SkillImportance = SkillImportance.MUST_HAVE
    match_type: SkillMatchType = SkillMatchType.GAP
    jd_context: str = ""
    resume_context: str = ""


class SkillScore(BaseModel):
    skill: str
    score: int = Field(ge=0, le=10)
    max_score: int = 10
    proficiency_level: ProficiencyLevel = ProficiencyLevel.BEGINNER
    evidence: str = ""
    strengths: list[str] = []
    gaps: list[str] = []


class AssessedSkill(BaseModel):
    name: str
    category: SkillCategory = SkillCategory.TECHNICAL
    importance: SkillImportance = SkillImportance.MUST_HAVE
    match_type: SkillMatchType = SkillMatchType.GAP
    jd_context: str = ""
    resume_context: str = ""
    status: AssessmentStatus = AssessmentStatus.PENDING
    score: Optional[SkillScore] = None
    questions_asked: int = 0


class Resource(BaseModel):
    type: str
    title: str
    url: str = ""
    format: str = ""
    estimated_hours: float = 0
    why: str = ""
    description: str = ""


class Milestone(BaseModel):
    week: int
    goal: str


class SkillLearningPlan(BaseModel):
    skill: str
    current_level: ProficiencyLevel = ProficiencyLevel.BEGINNER
    target_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    is_adjacent: bool = False
    adjacency_reason: str = ""
    estimated_hours: float = 0
    priority: str = "medium"
    resources: list[Resource] = []
    milestones: list[Milestone] = []


class SessionCreate(BaseModel):
    jd_text: str


class SessionResponse(BaseModel):
    session_id: str
    skills_to_assess: list[SkillGapItem]
    total_skills: int
    message: str


class ChatMessage(BaseModel):
    role: str
    content: str
    message_type: str = "text"  # text | mcq | coding | mcq_answer | code_answer
    metadata: dict = {}


class SkillProgressUpdate(BaseModel):
    skills: list[AssessedSkill]
    current_skill: Optional[str] = None
    completed_count: int = 0
    total_count: int = 0


class ReportData(BaseModel):
    session_id: str
    candidate_name: str = "Candidate"
    role_title: str = ""
    overall_score: float = 0
    overall_percentage: float = 0
    classification: str = ""
    skill_scores: list[SkillScore] = []
    learning_plans: list[SkillLearningPlan] = []
    assessed_skills: list[AssessedSkill] = []
    total_learning_hours: float = 0


class CodingChallenge(BaseModel):
    title: str = ""
    description: str = ""
    language: str = ""
    starter_code: str = ""
    examples: list[dict] = []
    hints: list[str] = []
    expected_approach: str = ""
    time_complexity: str = ""
    space_complexity: str = ""


class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    jd_text: str = ""
    resume_text: str = ""
    jd_skills: list[JDSkill] = []
    resume_skills: list[ResumeSkill] = []
    skills_to_assess: list[AssessedSkill] = []
    conversation_history: list[ChatMessage] = []
    current_skill_index: int = 0
    is_complete: bool = False
    report: Optional[ReportData] = None
    is_tech_role: bool = False
    coding_language: str = ""
    coding_phase: bool = False
    coding_challenge: Optional[CodingChallenge] = None
    coding_score: Optional[SkillScore] = None
