import json
import re
import logging
import asyncio
from app.config import get_settings

logger = logging.getLogger(__name__)

# ── Key rotation ─────────────────────────────────────────────────────
# Comma-separate keys from DIFFERENT Groq accounts in GROQ_API_KEY.
# Each account has its own 100k TPD limit. On 429 we rotate to the
# next key (= next account) instantly. Zero interruption for the user.

_keys: list[str] = []
_current_idx: int = 0


def _init_keys():
    global _keys, _current_idx
    if _keys:
        return
    settings = get_settings()
    _keys = [k.strip() for k in settings.groq_api_key.split(",") if k.strip()]
    if not _keys:
        _keys = [""]
    _current_idx = 0
    if len(_keys) > 1:
        logger.info(f"[key-pool] {len(_keys)} Groq keys loaded")


def _get_key() -> str:
    _init_keys()
    return _keys[_current_idx]


def _rotate_key() -> str:
    global _current_idx
    _init_keys()
    if len(_keys) <= 1:
        return _keys[0]
    _current_idx = (_current_idx + 1) % len(_keys)
    masked = _keys[_current_idx][:10] + "…"
    logger.warning(f"[key-pool] Rotated to key #{_current_idx + 1} ({masked})")
    return _keys[_current_idx]


def _should_rotate(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "429" in msg or "rate" in msg or "quota" in msg or "limit" in msg
        or "restricted" in msg or "organization" in msg
        or "401" in msg or "403" in msg or "invalid_api_key" in msg
    )


# ── Public API ───────────────────────────────────────────────────────

async def chat(
    messages: list[dict],
    system_prompt: str = "",
    max_tokens: int = 1024,
) -> str:
    _init_keys()
    last_exc: Exception | None = None

    for attempt in range(len(_keys)):
        try:
            return await _call_groq(messages, system_prompt, max_tokens=max_tokens)
        except Exception as exc:
            last_exc = exc
            if _should_rotate(exc) and attempt < len(_keys) - 1:
                _rotate_key()
                await asyncio.sleep(0.15)
                continue
            raise

    raise last_exc  # type: ignore[misc]


async def structured_output(prompt: str, max_tokens: int = 2048) -> dict | list:
    response = await _call_groq_json(
        [{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
    )
    result = _parse_json(response)

    # JSON mode forces a top-level object. If the prompt expected an array,
    # the model wraps it: {"skills": [...]} or {"items": [...]}. Unwrap it.
    if isinstance(result, dict) and len(result) == 1:
        only_val = next(iter(result.values()))
        if isinstance(only_val, list):
            return only_val

    return result


# ── Groq calls ───────────────────────────────────────────────────────

async def _call_groq(
    messages: list[dict],
    system_prompt: str = "",
    max_tokens: int = 1024,
) -> str:
    from openai import AsyncOpenAI

    settings = get_settings()
    client = AsyncOpenAI(
        api_key=_get_key(),
        base_url="https://api.groq.com/openai/v1",
        max_retries=0,
    )

    groq_messages = []
    if system_prompt:
        groq_messages.append({"role": "system", "content": system_prompt})
    for msg in messages:
        groq_messages.append({"role": msg["role"], "content": msg["content"]})

    response = await client.chat.completions.create(
        model=settings.groq_model,
        messages=groq_messages,
        temperature=0.7,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content


async def _call_groq_json(
    messages: list[dict],
    max_tokens: int = 2048,
) -> str:
    """Call Groq with JSON mode forced on — guarantees valid JSON output."""
    from openai import AsyncOpenAI

    _init_keys()
    settings = get_settings()
    last_exc: Exception | None = None

    for attempt in range(len(_keys)):
        try:
            client = AsyncOpenAI(
                api_key=_get_key(),
                base_url="https://api.groq.com/openai/v1",
                max_retries=0,
            )
            groq_messages = [{"role": msg["role"], "content": msg["content"]} for msg in messages]

            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=groq_messages,
                temperature=0.4,
                max_tokens=max_tokens,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as exc:
            last_exc = exc
            if _should_rotate(exc) and attempt < len(_keys) - 1:
                _rotate_key()
                await asyncio.sleep(0.15)
                continue
            raise

    raise last_exc  # type: ignore[misc]


# ── JSON parsing ─────────────────────────────────────────────────────

def _parse_json(text: str) -> dict | list:
    text = text.strip()
    json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if json_match:
        text = json_match.group(1).strip()

    text = text.strip()
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]

    cleaned = text.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    obj_match = re.search(r"\{[\s\S]*\}", cleaned)
    if obj_match:
        try:
            return json.loads(obj_match.group())
        except json.JSONDecodeError:
            pass

    array_match = re.search(r"\[[\s\S]*\]", cleaned)
    if array_match:
        try:
            return json.loads(array_match.group())
        except json.JSONDecodeError:
            pass

    # Handle nested braces: find the outermost balanced { ... }
    depth = 0
    start = -1
    for i, ch in enumerate(cleaned):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start >= 0:
                try:
                    return json.loads(cleaned[start:i + 1])
                except json.JSONDecodeError:
                    start = -1

    raise ValueError(f"Could not parse JSON from LLM response: {cleaned[:200]}")
