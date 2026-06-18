-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- LOOKUP TABLES
-- =====================================================

-- READ

CREATE POLICY degrees_read
ON degrees
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY institutes_read
ON institutes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY companies_read
ON companies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY keywords_read
ON keywords
FOR SELECT
TO authenticated
USING (true);

-- INSERT

CREATE POLICY degrees_insert
ON degrees
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY institutes_insert
ON institutes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY companies_insert
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY keywords_insert
ON keywords
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE

CREATE POLICY degrees_update
ON degrees
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY institutes_update
ON institutes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY companies_update
ON companies
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE

CREATE POLICY companies_delete
ON companies
FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- PROFILES
-- =====================================================

CREATE POLICY profile_select
ON profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

CREATE POLICY profile_insert
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY profile_update
ON profiles
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY profile_delete
ON profiles
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);

-- =====================================================
-- EDUCATION
-- =====================================================

CREATE POLICY education_select
ON education
FOR SELECT
TO authenticated
USING (
    true
);

CREATE POLICY education_insert
ON education
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL
);

CREATE POLICY education_update
ON education
FOR UPDATE
TO authenticated
USING (
    education IN (
        SELECT UNNEST(education)
        FROM profiles
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    education IN (
        SELECT UNNEST(education)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY education_delete
ON education
FOR DELETE
TO authenticated
USING (
    education IN (
        SELECT UNNEST(education)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- PROJECTS
-- =====================================================

CREATE POLICY projects_select
ON projects
FOR SELECT
TO authenticated
USING (
    project IN (
        SELECT UNNEST(projects)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY projects_insert
ON projects
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL
);

CREATE POLICY projects_update
ON projects
FOR UPDATE
TO authenticated
USING (
    project IN (
        SELECT UNNEST(projects)
        FROM profiles
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    project IN (
        SELECT UNNEST(projects)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY projects_delete
ON projects
FOR DELETE
TO authenticated
USING (
    project IN (
        SELECT UNNEST(projects)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- INTERNSHIPS
-- =====================================================

CREATE POLICY internships_select
ON internships
FOR SELECT
TO authenticated
USING (
    internship IN (
        SELECT UNNEST(intern)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY internships_insert
ON internships
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL
);

CREATE POLICY internships_update
ON internships
FOR UPDATE
TO authenticated
USING (
    internship IN (
        SELECT UNNEST(intern)
        FROM profiles
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    internship IN (
        SELECT UNNEST(intern)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY internships_delete
ON internships
FOR DELETE
TO authenticated
USING (
    internship IN (
        SELECT UNNEST(intern)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- ACHIEVEMENTS
-- =====================================================

CREATE POLICY achievements_select
ON achievements
FOR SELECT
TO authenticated
USING (
    achievement IN (
        SELECT UNNEST(achievements)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY achievements_insert
ON achievements
FOR INSERT
TO authenticated
WITH CHECK (
    true
);

CREATE POLICY achievements_update
ON achievements
FOR UPDATE
TO authenticated
USING (
    achievement IN (
        SELECT UNNEST(achievements)
        FROM profiles
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    achievement IN (
        SELECT UNNEST(achievements)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY achievements_delete
ON achievements
FOR DELETE
TO authenticated
USING (
    achievement IN (
        SELECT UNNEST(achievements)
        FROM profiles
        WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- AVAILABLE JOBS
-- =====================================================

CREATE POLICY jobs_select
ON available_jobs
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

CREATE POLICY jobs_insert
ON available_jobs
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY jobs_update
ON available_jobs
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY jobs_delete
ON available_jobs
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);

-- =====================================================
-- RESUMES
-- =====================================================

CREATE POLICY resumes_select
ON resumes
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

CREATE POLICY resumes_insert
ON resumes
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY resumes_update
ON resumes
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY resumes_delete
ON resumes
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);

-- =====================================================
-- STORAGE POLICIES
-- achievement proofs bucket
-- =====================================================

CREATE POLICY achievement_upload
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'achievement-proofs'
);

CREATE POLICY achievement_read
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'achievement-proofs'
);

CREATE POLICY achievement_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'achievement-proofs'
);