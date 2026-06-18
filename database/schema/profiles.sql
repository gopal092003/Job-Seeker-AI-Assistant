-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    education UUID[] DEFAULT '{}',
    keywords UUID[] DEFAULT '{}',
    projects UUID[] DEFAULT '{}',
    intern UUID[] DEFAULT '{}',
    achievements UUID[] DEFAULT '{}',

    handles JSONB DEFAULT '{}'::jsonb
);