"""Initialise the database by running sql/setup.sql."""

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

SQL_PATH = Path(__file__).resolve().parent / "sql" / "setup.sql"


def main() -> None:
    sql = SQL_PATH.read_text(encoding="utf-8")
    conn = psycopg2.connect(DATABASE_URL)
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(sql)
        print("Database initialization completed successfully")
    finally:
        conn.close()


if __name__ == "__main__":
    main()