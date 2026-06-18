# Part 3 - Resume Generation, PDF Creation, Email Delivery & Agent Scheduling System

# Overview

Part 3 begins after Part 2 has completed.

At this stage:

* Jobs have already been discovered.
* Jobs have already been analyzed.
* Jobs have already been filtered.
* Contact information has already been detected.
* Fresher suitability has already been determined.

The purpose of Part 3 is to:

* Select notification-eligible jobs
* Match jobs against user profiles
* Identify required skills
* Identify relevant projects
* Generate tailored resume content
* Generate resume PDFs
* Send emails to users
* Prevent duplicate emails
* Repeat automatically according to user schedule

At the end of Part 3:

The user receives:

* Job Links
* Tailored Resume PDFs

for newly discovered jobs.

---

# Step 1 - Agent Scheduler

Every user can configure:

```
Agent Active Start Time

Agent Active End Time

Email Frequency
```

Examples:

```
4:00 AM → 8:00 PM

Frequency: Every 1 Hour
```

or

```
6:00 AM → 10:00 PM

Frequency: Every 2 Hours
```

---

# Agent Runtime Validation

Before every execution:

System checks:

```
Current Time
```

against:

```
Active Start Time

Active End Time
```

If current time is outside the configured window:

```
Agent Sleeps
```

No processing occurs.

---

## Example

Configuration:

```
4:00 AM → 8:00 PM
```

Current Time:

```
11:00 PM
```

Result:

```
Agent Does Not Run
```

---

# Step 2 - Scheduler Trigger

During active hours:

Agent wakes up according to configured frequency.

Examples:

### Hourly

```
4:00
5:00
6:00
7:00
...
```

### Every 2 Hours

```
4:00
6:00
8:00
10:00
...
```

### Every 4 Hours

```
4:00
8:00
12:00
4:00
...
```

At every trigger:

Part 2 executes first.

---

# Step 3 - Retrieve Notification Eligible Jobs

After Part 2 completes:

System retrieves jobs where:

```
is_selected = TRUE
```

AND

```
within_notification_window = TRUE
```

AND

```
user_id exists in user_ids
```

AND

```
Job Not Previously Emailed
```

for the current user.

---

# Step 4 - Duplicate Email Prevention

Before processing any job:

System checks:

```
job_notifications
```

table.

---

## Notification Table

Columns:

```
notification_id

user_id

job_uuid

sent_at
```

---

## Validation

If:

```
user_id + job_uuid
```

already exists:

```
Skip Job
```

No new email is sent.

---

## Example

Job:

```
job_123
```

Already emailed at:

```
10:00 AM
```

Current run:

```
11:00 AM
```

Result:

```
Skip
```

---

# Step 5 - Job Processing Loop

Remaining jobs enter a processing queue.

Example:

```
Job A
↓
Job B
↓
Job C
```

Each job is processed independently.

---

# Step 6 - Retrieve User Profile Data

For the current user:

System retrieves:

```
Projects

Internships

Education

Achievements

Handles
```

from database.

---

# Projects Retrieved

For every project:

Retrieve:

```
Project Title

Project Links

Project Description
```

---

# Internships Retrieved

For every internship:

Retrieve:

```
Company Name

Role

Internship Links

Internship Description
```

---

# Education Retrieved

For every education entry:

Retrieve:

```
Institution

Degree

Specialization

Grade

Additional Notes
```

---

# Achievements Retrieved

Retrieve:

```
Achievement Description

Achievement Proof
```

---

# Step 7 - LLM Call #1

Purpose:

Understand job requirements.

Input:

```json
{
    "job_description": "...",

    "projects": [
        {
            "project_title": "...",

            "skills": [...]
        }
    ]
}
```

Prompt contains instructions to:

* Extract required skills
* Identify relevant technologies
* Rank user projects
* Select top 3 projects

---

# Expected Output

```json
{
    "required_skills": [
        ...
    ],

    "top_projects": [
        "project_id_3",
        "project_id_8",
        "project_id_2"
    ]
}
```

---

# Step 8 - Retrieve Complete Data

Using:

```
top_projects
```

System loads:

```
Complete Project Descriptions
```

for selected projects.

System also loads:

```
All Internship Descriptions

All Education Records

All Achievements
```

---

# Step 9 - LLM Call #2

Purpose:

Generate ATS-optimized resume sections.

Input:

```json
{
    "required_skills": [...],

    "project_descriptions": [...],

    "internship_descriptions": [...],

    "education": [...],

    "achievements": [...],

    "job_description": "..."
}
```

Prompt includes:

* Character limits
* Token limits
* Resume formatting constraints
* ATS optimization rules

---

# Expected Output

```json
{
    "skills_section": [...],

    "projects_section": [...],

    "internship_section": [...],

    "achievement_section": [...]
}
```

Every bullet follows predefined constraints.

---

# Step 10 - Resume Assembly

Python receives:

```json
{
    "skills_section": [...],

    "projects_section": [...],

    "internship_section": [...],

    "achievement_section": [...]
}
```

System fills predefined LaTeX template.

Example:

```latex
\section{Skills}

...

\section{Projects}

...

\section{Internships}

...

\section{Achievements}
```

Output:

```
resume.tex
```

---

# Step 11 - PDF Generation

Tool:

```
TeX Live
```

Compiler:

```
pdflatex
```

Execution:

```bash
pdflatex resume.tex
```

Output:

```
resume.pdf
```

Generated specifically for:

```
User X
+
Job Y
```

---

# Step 12 - Resume Storage

Generated resumes are stored.

Table:

```
generated_resumes
```

Columns:

```
resume_uuid

user_id

job_uuid

pdf_path

created_at
```

---

# Example

```json
{
    "resume_uuid": "resume_123",

    "user_id": "user_1",

    "job_uuid": "job_456",

    "pdf_path": "/resumes/resume_123.pdf"
}
```

---

# Step 13 - Email Payload Creation

System prepares:

```
Job Link

Resume PDF
```

for every processed job.

---

# Step 14 - Email Aggregation

Instead of sending one email per job:

All jobs discovered during the current cycle are grouped.

Example:

```
3 Jobs Found
```

One email is created.

---

# Email Content

Subject:

```
3 New Jobs Found Matching Your Profile
```

Body:

```
Job 1

Job Link

Resume Attached


Job 2

Job Link

Resume Attached


Job 3

Job Link

Resume Attached
```

---

# Step 15 - Email Delivery

Tool:

```
Resend
```

Purpose:

* Send Emails
* Attach PDFs
* Deliver Job Links

Flow:

```
Backend
↓
Resend API
↓
User Inbox
```

---

# Step 16 - Notification Logging

After successful delivery:

Rows are inserted into:

```
job_notifications
```

table.

Columns:

```
notification_id

user_id

job_uuid

resume_uuid

sent_at
```

---

# Example

```json
{
    "user_id": "user_1",

    "job_uuid": "job_456",

    "resume_uuid": "resume_123",

    "sent_at": "2026-06-07T10:00:00Z"
}
```

---

# Step 17 - Agent Wait State

After completion:

Agent enters waiting state.

Example:

```
Frequency = 1 Hour
```

Current Run:

```
10:00 AM
```

Next Run:

```
11:00 AM
```

---

# Step 18 - Continuous Operation

The process repeats:

```
Search Jobs
↓
Analyze Jobs
↓
Generate Resumes
↓
Send Email
↓
Wait
↓
Repeat
```

throughout the user's configured active window.

---

# Step 19 - Agent Stop

User clicks:

```
Stop Agent
```

System updates:

```
agent_status = FALSE
```

Future scheduled runs are cancelled.

No further:

* Job Searches
* Resume Generation
* Email Deliveries

occur until the user starts the agent again.

---

# Part 3 Flow

```
Scheduler Trigger
        ↓
Check Active Hours
        ↓
Run Part 2
        ↓
Retrieve Eligible Jobs
        ↓
Check Notification History
        ↓
Retrieve User Data
        ↓
LLM Call #1
        ↓
Required Skills + Top Projects
        ↓
Retrieve Full Data
        ↓
LLM Call #2
        ↓
Resume Sections
        ↓
Generate LaTeX
        ↓
Compile PDF (TeX Live)
        ↓
Store Resume
        ↓
Aggregate Jobs
        ↓
Send Email (Resend)
        ↓
Log Notifications
        ↓
Wait Until Next Cycle
        ↓
Repeat
```
