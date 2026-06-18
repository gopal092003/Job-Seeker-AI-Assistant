# Database

This folder contains all database-related files for the AI Job Search Agent platform.

The project uses:

* PostgreSQL
* Supabase Database
* Supabase Authentication
* Supabase Storage
* Supabase SQL Editor

The database schema is designed to support:

* User Profiles
* Education History
* Skills & Keywords
* Projects
* Internships
* Achievements
* Job Discovery
* Resume Generation
* Row Level Security (RLS)
* Automated Database Triggers
* Achievement Proof Storage

---

# Folder Structure

```
database/
│
├── supabase-migration.sql
│
├── schema/
│   ├── profiles.sql
│   ├── education.sql
│   ├── degrees.sql
│   ├── institutes.sql
│   ├── keywords.sql
│   ├── projects.sql
│   ├── internships.sql
│   ├── companies.sql
│   ├── achievements.sql
│   ├── available_jobs.sql
│   ├── resumes.sql
│   └── indexes.sql
│
├── rls_policies.sql
├── functions.sql
│
└── README.md
```

---

# Setup

## Method 1 — Supabase SQL Editor

Open:

```
Supabase Dashboard
    ↓
SQL Editor
```

Run the files in the following order:

```
1. supabase-migration.sql
2. rls_policies.sql
3. functions.sql
```

This creates:

* Tables
* Foreign Keys
* Indexes
* RLS Policies
* Functions
* Triggers

required by the platform.

---

## Method 2 — Schema Files

Execute the files manually:

```
schema/*
↓
indexes.sql
↓
rls_policies.sql
↓
functions.sql
```

---

## Method 3 — Supabase CLI

```
supabase db push
```

after configuring the project.

---

# Database Architecture

The database consists of two categories of tables.

## User-Owned Tables

These tables contain user-specific information.

```
profiles
education
projects
internships
achievements
available_jobs
resumes
```

Protected by Row Level Security.

---

## Shared Lookup Tables

These tables store reusable normalized values.

```
degrees
institutes
companies
keywords
```

Accessible by authenticated users.

---

# Schema Overview

## profiles

Stores the master profile for each authenticated user.

Columns:

```
user_id
name
email

education[]
keywords[]
projects[]
intern[]
achievements[]

handles
```

Purpose:

* Master user record
* Stores references to related entities
* Stores social/profile links

Example handles:

```json
{
  "github": "https://github.com/user",
  "linkedin": "https://linkedin.com/in/user",
  "portfolio": "https://portfolio.com"
}
```

---

## education

Stores educational qualifications.

Columns:

```
education

degree
cgpa

institute

start_date
end_date

created_at
updated_at
```

Purpose:

* Academic history
* Resume generation input

---

## degrees

Stores normalized degree names.

Examples:

```
B.Tech
M.Tech
MBA
BCA
MCA
```

Columns:

```
degree
name
```

Purpose:

* Degree normalization
* Autocomplete
* Search

---

## institutes

Stores normalized institute names.

Examples:

```
IIT Delhi
IIT Bombay
NIT Bhopal
BITS Pilani
```

Columns:

```
institute
name
```

Purpose:

* Institute normalization
* Autocomplete
* Search

---

## keywords

Stores user job-interest keywords.

Examples:

```
Software Engineer
Backend Engineer
AI Engineer
ML Engineer
Data Scientist
```

Columns:

```
keyword
name
```

Purpose:

* Job discovery
* Agent filtering
* Search personalization

---

## projects

Stores project information.

Columns:

```
project

title

links[]

description

skills[]

created_at
updated_at
```

Purpose:

* Resume generation
* Candidate evaluation
* Skill extraction

---

## internships

Stores internship experience.

Columns:

```
internship

company

designation

start_date
end_date

description

created_at
updated_at
```

Purpose:

* Resume generation
* Experience ranking
* Job matching

---

## companies

Stores normalized company names.

Examples:

```
Google
Microsoft
Amazon
OpenAI
Meta
```

Columns:

```
company
name
```

Purpose:

* Company normalization
* Autocomplete
* Search

---

## achievements

Stores user achievements.

Columns:

```
achievement

description

proof

date

created_at
updated_at
```

Purpose:

* Resume generation
* Candidate ranking

The `proof` field stores a URL pointing to files uploaded to Supabase Storage.

---

## available_jobs

Stores jobs discovered and processed by the AI agent.

Columns:

```
user_id

job_link

posted_time

description

mail
number

contains_zero
contains_yoe
contains_year
contains_experience

skills[]

selected
```

Primary Key:

```
(user_id, job_link)
```

Purpose:

* Store discovered jobs
* Store parsed descriptions
* Store filtering results
* Track user selections

---

## resumes

Stores generated resume selections for a specific job.

Columns:

```
user_id
job_link

intern

project_1
project_2
project_3

achievement
```

Primary Key:

```
(user_id, job_link)
```

Purpose:

* Resume generation output
* Associate resume content with a job

---

# Row Level Security (RLS)

The platform uses Supabase Row Level Security.

## Protected Tables

```
profiles
education
projects
internships
achievements
available_jobs
resumes
```

Policies enforce:

```
SELECT
INSERT
UPDATE
DELETE
```

based on ownership and profile relationships.

---

## Shared Lookup Tables

```
degrees
institutes
companies
keywords
```

Authenticated users can:

```
SELECT
INSERT
```

and update lookup values where permitted by policy.

---

## Storage Policies

Bucket:

```
achievement-proofs
```

Policies allow authenticated users to:

```
UPLOAD
READ
DELETE
```

achievement proof files.

---

# Functions

The database includes reusable PostgreSQL functions.

## set_updated_at()

Automatically updates:

```
updated_at
```

before row updates.

Used by:

```
education
projects
internships
achievements
```

---

## create_profile_for_new_user()

Automatically creates a profile after:

```
auth.users
↓
INSERT
```

Uses:

```
raw_user_meta_data.user_name
```

or

```
raw_user_meta_data.name
```

when available.

---

## generate_uuid()

Utility helper.

Returns:

```sql
gen_random_uuid()
```

---

## get_job_stats()

Returns:

```
total_jobs
selected_jobs
```

for a user.

Used by:

* Dashboard analytics
* Agent monitoring

---

## delete_user_data()

Deletes all user-owned platform data.

Used during:

```
Account Deletion
```

operations.

---

# Triggers

## updated_at Triggers

Automatically update:

```
updated_at
```

for:

```
education
projects
internships
achievements
```

---

## User Signup Trigger

Automatically creates a profile after:

```
auth.users INSERT
```

This removes the need for manual profile initialization.

---

# Indexes

Indexes exist for:

```
profiles.email

keywords.name

degrees.name

institutes.name

companies.name

available_jobs.user_id
available_jobs.job_link

resumes.user_id
resumes.job_link
```

Purpose:

* Faster searches
* Faster filtering
* Faster dashboard queries
* Faster resume retrieval
* Faster job retrieval

---

# Design Notes

The schema intentionally favors simplicity and rapid development.

Relationships between user-owned entities are maintained using UUID arrays stored inside the profile record:

```
profiles.education[]
profiles.projects[]
profiles.intern[]
profiles.achievements[]
profiles.keywords[]
```

Advantages:

* Simple profile loading
* Minimal joins
* Fast Python processing
* Straightforward resume generation

Trade-offs:

* More complex RLS policies
* Ownership checks rely on UUID-array membership
* Less normalized than traditional relational designs

This design is suitable for the current MVP and can be evolved later if required.

Future improvements may include:

* Additional foreign keys
* Full normalization
* Audit logging
* Advanced search indexes
* Analytics tables
* Background job tables
* Materialized views
* Resume versioning
* Job application tracking

```
```
