-- =====================================================
-- EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- DEGREES
-- =====================================================

CREATE TABLE degrees (
    degree UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================================================
-- INSTITUTES
-- =====================================================

CREATE TABLE institutes (
    institute UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================================================
-- COMPANIES
-- =====================================================

CREATE TABLE companies (
    company UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================================================
-- KEYWORDS
-- =====================================================

CREATE TABLE keywords (
    keyword UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,

    name TEXT NOT NULL,
    email TEXT NOT NULL,

    education UUID[] DEFAULT '{}',
    keywords UUID[] DEFAULT '{}',
    projects UUID[] DEFAULT '{}',
    intern UUID[] DEFAULT '{}',
    achievements UUID[] DEFAULT '{}',

    handles JSONB DEFAULT '{}'
);

-- =====================================================
-- EDUCATION
-- =====================================================

CREATE TABLE education (
    education UUID PRIMARY KEY,

    degree UUID NOT NULL,
    cgpa NUMERIC,

    institute UUID NOT NULL,

    start_date DATE,
    end_date DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_education_degree
        FOREIGN KEY (degree)
        REFERENCES degrees(degree),

    CONSTRAINT fk_education_institute
        FOREIGN KEY (institute)
        REFERENCES institutes(institute)
);

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

-- =====================================================
-- INTERNSHIPS
-- =====================================================

CREATE TABLE internships (
    internship UUID PRIMARY KEY,

    company UUID NOT NULL,

    start_date DATE,
    end_date DATE,

    designation TEXT,

    description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_internships_company
        FOREIGN KEY (company)
        REFERENCES companies(company)
);

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

-- =====================================================
-- AVAILABLE JOBS
-- =====================================================

CREATE TABLE available_jobs (
    user_id UUID NOT NULL,

    job_link TEXT NOT NULL,

    posted_time TIMESTAMP,

    description TEXT,

    mail BOOLEAN DEFAULT FALSE,
    number BOOLEAN DEFAULT FALSE,

    contains_zero BOOLEAN DEFAULT FALSE,
    contains_yoe BOOLEAN DEFAULT FALSE,
    contains_year BOOLEAN DEFAULT FALSE,
    contains_experience BOOLEAN DEFAULT FALSE,

    skills TEXT[] DEFAULT '{}',

    selected BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (user_id, job_link),

    CONSTRAINT fk_jobs_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles(user_id)
        ON DELETE CASCADE
);

-- =====================================================
-- RESUMES
-- =====================================================

CREATE TABLE resumes (
    user_id UUID NOT NULL,
    job_link TEXT NOT NULL,

    intern TEXT,

    project_1 TEXT,
    project_2 TEXT,
    project_3 TEXT,

    achievement TEXT,

    PRIMARY KEY (user_id, job_link),

    CONSTRAINT fk_resumes_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_resumes_job
        FOREIGN KEY (user_id, job_link)
        REFERENCES available_jobs(user_id, job_link)
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_profiles_email
ON profiles(email);

CREATE INDEX idx_keywords_name
ON keywords(name);

CREATE INDEX idx_degrees_name
ON degrees(name);

CREATE INDEX idx_institutes_name
ON institutes(name);

CREATE INDEX idx_companies_name
ON companies(name);

CREATE INDEX idx_jobs_user
ON available_jobs(user_id);

CREATE INDEX idx_jobs_link
ON available_jobs(job_link);

CREATE INDEX idx_resumes_user
ON resumes(user_id);

CREATE INDEX idx_resumes_job
ON resumes(job_link);