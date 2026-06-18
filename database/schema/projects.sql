-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (
    project UUID PRIMARY KEY,

    title TEXT NOT NULL,

    links TEXT[] DEFAULT '{}',

    description TEXT,

    skills TEXT[] DEFAULT '{}',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);