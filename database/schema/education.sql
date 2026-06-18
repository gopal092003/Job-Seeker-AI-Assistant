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