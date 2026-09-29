# FastAPI application entry point
# Handles health check and authentication via Supabase Auth

import os
from pathlib import Path

import httpx
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load .env from the backend folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

# Supabase credentials — read once at startup, never logged
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")

# ── App setup ─────────────────────────────────────────────────

app = FastAPI()

# CORS — allow local dev and any Vercel preview deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / response models ─────────────────────────────────

class AuthRequest(BaseModel):
    email: str
    password: str


# ── Supabase Auth helpers ─────────────────────────────────────

def _supabase_headers(access_token: str | None = None) -> dict:
    """Build headers for Supabase Auth REST calls."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
    }
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    return headers


def _friendly_error(resp: httpx.Response) -> str:
    """Turn a Supabase error response into a user-friendly message."""
    try:
        body = resp.json()
    except Exception:
        return "Something went wrong. Please try again."

    # Check error_code first, then msg/message
    error_code = body.get("error_code", "")
    msg = body.get("msg", "") or body.get("message", "")

    if error_code == "user_already_exists" or "already registered" in msg.lower():
        return "An account with this email already exists"

    if error_code == "weak_password" or "password" in msg.lower() and "6" in msg:
        return "Password must be at least 6 characters"

    if error_code in ("invalid_credentials", "invalid_grant"):
        return "Incorrect email or password"

    # If Supabase gave a human-readable msg, use it
    if msg:
        return msg

    return "Something went wrong. Please try again."


def _extract_user(user_response: dict) -> dict:
    """Pull id and email from a Supabase user object."""
    return {
        "id": user_response.get("id", ""),
        "email": user_response.get("email", ""),
    }


def _get_user_id(authorization: str | None) -> str:
    """Verify the Bearer token with Supabase Auth and return the user id.
    Raises 401 if the token is missing, malformed, or invalid.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = parts[1]

    with httpx.Client() as client:
        resp = client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers=_supabase_headers(access_token=token),
        )

    if resp.status_code >= 400:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return resp.json().get("id", "")


def _token_response(data: dict) -> dict:
    """Build a standard token response from Supabase data."""
    user = _extract_user(data.get("user", {}))
    return {
        "access_token": data.get("access_token", ""),
        "refresh_token": data.get("refresh_token", ""),
        "expires_in": data.get("expires_in", 3600),
        "token_type": data.get("token_type", "bearer"),
        "user": user,
    }


@app.get("/api/health")
def health_check():
    """Simple endpoint to confirm the backend is running."""
    return {"status": "ok"}


@app.post("/api/auth/signup")
def signup(body: AuthRequest):
    """Create a new user via Supabase Auth.
    Returns the same token shape as login so the frontend can
    call setAuth() immediately after signup.
    """
    # 1. Ask Supabase to create the user
    with httpx.Client() as client:
        resp = client.post(
            f"{SUPABASE_URL}/auth/v1/signup",
            headers=_supabase_headers(),
            json={"email": body.email, "password": body.password},
        )

    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=_friendly_error(resp))

    data = resp.json()

    # 2. If Supabase returned a session (email confirmation is off), use it
    if data.get("access_token"):
        return _token_response(data)

    # 3. No session returned — auto-login right after signup
    with httpx.Client() as client:
        login_resp = client.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers=_supabase_headers(),
            json={"email": body.email, "password": body.password},
        )

    if login_resp.status_code >= 400:
        raise HTTPException(
            status_code=login_resp.status_code,
            detail=_friendly_error(login_resp),
        )

    return _token_response(login_resp.json())


@app.post("/api/auth/login")
def login(body: AuthRequest):
    """Log in an existing user via Supabase Auth."""
    with httpx.Client() as client:
        resp = client.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers=_supabase_headers(),
            json={"email": body.email, "password": body.password},
        )

    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=_friendly_error(resp))

    return _token_response(resp.json())


@app.get("/api/auth/me")
def get_me(authorization: str | None = Header(default=None)):
    """Protected route — returns the current user's id and email.
    Requires a valid Bearer token in the Authorization header.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Extract the token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = parts[1]

    with httpx.Client() as client:
        resp = client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers=_supabase_headers(access_token=token),
        )

    if resp.status_code >= 400:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return _extract_user(resp.json())


# ── Database helpers ──────────────────────────────────────────

DATABASE_URL = os.environ.get("DATABASE_URL", "")


def _db():
    """Open a new database connection. Caller must close it."""
    return psycopg2.connect(DATABASE_URL)


# ── Profile request models ───────────────────────────────────

class DetailsRequest(BaseModel):
    full_name: str
    phone: str
    contact_time: str


class BriefRequest(BaseModel):
    budget: str
    property_type: str
    preferred_areas: str
    investment_goal: str


# ── Profile routes ───────────────────────────────────────────

def _empty_profile() -> dict:
    """Default profile returned when no row exists yet."""
    return {
        "full_name": None,
        "phone": None,
        "contact_time": None,
        "budget": None,
        "property_type": None,
        "preferred_areas": None,
        "investment_goal": None,
        "status": "draft",
    }


def _row_to_profile(row: tuple) -> dict:
    """Convert a database row tuple to a profile dict."""
    # Columns: full_name, phone, contact_time, budget,
    #           property_type, preferred_areas, investment_goal, status
    return {
        "full_name": row[0],
        "phone": row[1],
        "contact_time": row[2],
        "budget": row[3],
        "property_type": row[4],
        "preferred_areas": row[5],
        "investment_goal": row[6],
        "status": row[7],
    }


@app.get("/api/profile")
def get_profile(authorization: str | None = Header(default=None)):
    """Return the logged-in user's profile, or an empty draft if none exists."""
    user_id = _get_user_id(authorization)

    try:
        conn = _db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT full_name, phone, contact_time, budget, "
                    "property_type, preferred_areas, investment_goal, status "
                    "FROM client_profiles WHERE user_id = %s",
                    (user_id,),
                )
                row = cur.fetchone()
        finally:
            conn.close()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not load your profile")

    if row:
        return _row_to_profile(row)

    return _empty_profile()


@app.put("/api/profile/details")
def save_details(
    body: DetailsRequest,
    authorization: str | None = Header(default=None),
):
    """Create or update the details section of the profile.
    Upserts on user_id. Does not change status.
    """
    user_id = _get_user_id(authorization)

    try:
        conn = _db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO client_profiles
                        (user_id, full_name, phone, contact_time, updated_at)
                    VALUES (%s, %s, %s, %s, now())
                    ON CONFLICT (user_id) DO UPDATE SET
                        full_name    = EXCLUDED.full_name,
                        phone        = EXCLUDED.phone,
                        contact_time = EXCLUDED.contact_time,
                        updated_at   = now()
                    """,
                    (user_id, body.full_name, body.phone, body.contact_time),
                )
            conn.commit()
        finally:
            conn.close()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not save your details")

    # Return the updated profile
    return get_profile(authorization)


@app.put("/api/profile/brief")
def save_brief(
    body: BriefRequest,
    authorization: str | None = Header(default=None),
):
    """Create or update the brief section of the profile.
    Upserts on user_id. Sets status to 'submitted'.
    """
    user_id = _get_user_id(authorization)

    try:
        conn = _db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO client_profiles
                        (user_id, budget, property_type, preferred_areas,
                         investment_goal, status, updated_at)
                    VALUES (%s, %s, %s, %s, %s, 'submitted', now())
                    ON CONFLICT (user_id) DO UPDATE SET
                        budget          = EXCLUDED.budget,
                        property_type   = EXCLUDED.property_type,
                        preferred_areas = EXCLUDED.preferred_areas,
                        investment_goal = EXCLUDED.investment_goal,
                        status          = 'submitted',
                        updated_at      = now()
                    """,
                    (
                        user_id,
                        body.budget,
                        body.property_type,
                        body.preferred_areas,
                        body.investment_goal,
                    ),
                )
            conn.commit()
        finally:
            conn.close()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not save your brief")

    return get_profile(authorization)
