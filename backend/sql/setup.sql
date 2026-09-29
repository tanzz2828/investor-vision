-- Idempotent database setup for client_profiles
-- Safe to run multiple times.

-- 1. Extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Table
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       text        NULL,
    phone           text        NULL,
    contact_time    text        NULL,
    budget          text        NULL,
    property_type   text        NULL,
    preferred_areas text        NULL,
    investment_goal text        NULL,
    status          text        NOT NULL DEFAULT 'draft',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- 3. Status check constraint (idempotent)
DO $$
BEGIN
    ALTER TABLE public.client_profiles
        ADD CONSTRAINT client_profiles_status_check
        CHECK (status IN ('draft', 'submitted'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 4. Index on user_id
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id
    ON public.client_profiles(user_id);

-- 5. Row Level Security — enabled, no policies (backend uses service role)
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;