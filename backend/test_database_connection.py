"""Verify the database connection and confirm client_profiles exists."""

import sys
from pathlib import Path

from dotenv import load_dotenv
import psycopg2
import os

# Load environment variables from backend/.env
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL is not set in backend/.env")
    sys.exit(1)

CHECK_SQL = """
SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name   = 'client_profiles'
);
"""


def main() -> None:
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            cur.execute(CHECK_SQL)
            exists = cur.fetchone()[0]
        print("Database connection successful")
        if exists:
            print("Table found: public.client_profiles")
        else:
            print("ERROR: Table public.client_profiles does NOT exist")
            sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()