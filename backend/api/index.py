# FastAPI application entry point
from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
def health_check():
    """Simple endpoint to confirm the backend is running."""
    return {"status": "ok"}
