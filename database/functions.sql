-- =====================================================
-- GENERIC updated_at TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- ATTACH updated_at TRIGGERS
-- =====================================================

CREATE TRIGGER trg_education_updated_at
BEFORE UPDATE ON education
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_internships_updated_at
BEFORE UPDATE ON internships
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_achievements_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- PROFILE CREATION AFTER AUTH SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.profiles (
        user_id,
        name,
        email
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'user_name',
            NEW.raw_user_meta_data->>'name',
            'User'
        ),
        NEW.email
    );

    RETURN NEW;

END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- =====================================================
-- UUID HELPER
-- =====================================================

CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS UUID
LANGUAGE SQL
AS $$
    SELECT gen_random_uuid();
$$;

-- =====================================================
-- JOB DASHBOARD STATS
-- =====================================================

CREATE OR REPLACE FUNCTION get_job_stats(
    p_user_id UUID
)
RETURNS TABLE (
    total_jobs BIGINT,
    selected_jobs BIGINT
)
LANGUAGE SQL
AS $$
    SELECT
        COUNT(*) AS total_jobs,
        COUNT(*) FILTER (
            WHERE selected = TRUE
        ) AS selected_jobs
    FROM available_jobs
    WHERE user_id = p_user_id;
$$;

-- =====================================================
-- DELETE ALL USER DATA
-- =====================================================

CREATE OR REPLACE FUNCTION delete_user_data(
    p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

    DELETE FROM resumes
    WHERE user_id = p_user_id;

    DELETE FROM available_jobs
    WHERE user_id = p_user_id;

    DELETE FROM profiles
    WHERE user_id = p_user_id;

END;
$$;