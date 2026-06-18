-- =====================================================
-- ACHIEVEMENTS
-- =====================================================

CREATE TABLE achievements (
    achievement UUID PRIMARY KEY,

    description TEXT,

    proof TEXT,

    date DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);