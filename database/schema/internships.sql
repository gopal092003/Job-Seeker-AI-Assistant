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
        REFERENCES companies(company),

    CONSTRAINT chk_internship_dates
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        )
);