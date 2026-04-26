from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    llm_provider: str = "groq"
    gemini_model: str = "gemini-2.0-flash-lite"
    gemini_api_key: str = ""
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    openai_api_key: str = ""
    frontend_url: str = "http://localhost:5174"
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_jwt_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def clear_settings_cache():
    get_settings.cache_clear()
