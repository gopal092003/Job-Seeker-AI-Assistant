CREATE TABLE resumes (
    user_id UUID NOT NULL,
    job_link TEXT NOT NULL,

    intern TEXT,

    project_1 TEXT,
    project_2 TEXT,
    project_3 TEXT,

    achievement TEXT,

    PRIMARY KEY (user_id, job_link),

    FOREIGN KEY (user_id)
        REFERENCES profiles(user_id),

    FOREIGN KEY (user_id, job_link)
        REFERENCES available_jobs(user_id, job_link)
);