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

    FOREIGN KEY (user_id)
        REFERENCES profiles(user_id)

);