# FastAPI application entry point
# Handles health check and authentication via Supabase Auth

import os
from pathlib import Path

import httpx
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
