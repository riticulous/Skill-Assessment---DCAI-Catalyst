import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import session, chat, report, history

logging.basicConfig(level=logging.INFO)
logging.getLogger("hpack").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)

settings = get_settings()

app = FastAPI(
    title="SkillProbe API",
    description="AI-Powered Skill Assessment & Personalized Learning Plan Agent",
    version="1.0.0",
)

cors_origins = [
    settings.frontend_url,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]
cors_origins = [o for o in cors_origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(history.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "message": "SkillProbe API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy", "provider": settings.llm_provider}
