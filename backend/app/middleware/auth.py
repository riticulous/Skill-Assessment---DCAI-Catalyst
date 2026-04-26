import logging
import jwt
import httpx
from fastapi import Request, HTTPException
from app.config import get_settings

logger = logging.getLogger(__name__)


async def get_current_user(request: Request) -> str:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        logger.warning("No Bearer token in Authorization header")
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ", 1)[1]
    if not token or token == "null":
        logger.warning("Token is empty or literal 'null'")
        raise HTTPException(status_code=401, detail="No token provided")

    return await verify_token(token)


async def verify_token(token: str) -> str:
    settings = get_settings()

    # Approach 1: Decode the JWT directly using the Supabase JWT secret
    if settings.supabase_jwt_secret:
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
            user_id = payload.get("sub")
            if user_id:
                return user_id
        except jwt.ExpiredSignatureError:
            logger.error("JWT token has expired")
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as e:
            logger.error(f"JWT decode failed: {e}")
            raise HTTPException(status_code=401, detail="Invalid token")

    # Approach 2: Call Supabase Auth API directly via HTTP
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_key,
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                user_id = data.get("id")
                if user_id:
                    return user_id
            logger.error(f"Supabase auth API returned {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"HTTP call to Supabase auth failed: {e}")

    raise HTTPException(status_code=401, detail="Invalid or expired token")
