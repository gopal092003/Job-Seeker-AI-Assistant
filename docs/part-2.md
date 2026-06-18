# Part 2 - Agent Execution, Job Discovery, Job Analysis & Job Storage System

## Overview

Part 2 begins when a user clicks:

```
Start Agent
```

The purpose of Part 2 is to:

* Retrieve user keywords
* Discover LinkedIn jobs
* Filter jobs to past 24 hours
* Avoid duplicate jobs
* Extract job descriptions
* Analyze descriptions
* Detect experience requirements
* Detect contact information
* Select or reject jobs
* Associate jobs with users
* Store jobs in database
* Automatically remove expired jobs

At the end of Part 2, the system has a database of fresh jobs that have already been filtered for fresher suitability.

---

# Step 1 - Agent Startup

User clicks:

```
Start Agent
```

System verifies:

```
profile.keyword_ids.length > 0
```

If no keywords exist:

```
Agent cannot start.
```

User is prompted to add keywords first.

If keywords exist:

```
agent_status = TRUE
```

is updated in:

```
profiles
```

table.

UI changes:

```
Start Agent
```

becomes:

```
Stop Agent
```

---

# Step 2 - Retrieve User Keywords

System retrieves:

```
keyword_ids
```

from:

```
profiles
```

Example:

```json
[
    "k1",
    "k2",
    "k3"
]
```

---

# Step 3 - Retrieve Actual Keywords

Using keyword_ids:

System retrieves keyword records from:

```
keywords
```

table.

Example:

```json
[
    {
        "keyword": "AI Engineer"
    },
    {
        "keyword": "Machine Learning Engineer"
    },
    {
        "keyword": "Data Scientist"
    }
]
```

These become the search targets.

---

# Step 4 - Keyword Processing Loop

A loop begins.

Keywords are processed one at a time.

Example:

```
AI Engineer
        ↓

Machine Learning Engineer
        ↓

Data Scientist
```

The loop continues until all keywords have been searched.

---

# Step 5 - LinkedIn Job Search

Tool Used:

```
Playwright
```

Purpose:

* Open LinkedIn Jobs
* Enter keyword
* Apply filters
* Collect job results

Playwright acts as the browser automation layer.

---

# Step 6 - Apply LinkedIn Filter

Before collecting jobs:

LinkedIn filter:

```
Past 24 Hours
```

is applied.

This ensures:

* Only fresh jobs are collected.
* Older jobs are ignored.
* Database remains small.
* Search remains fast.

---

# Step 7 - Job Discovery

Playwright scrolls through LinkedIn results.

For every discovered job:

The following information is extracted:

```json
{
    "job_link": "",
    "posted_at": ""
}
```

Fields:

### job_link

LinkedIn job URL.

Example:

```
https://www.linkedin.com/jobs/view/123456789
```

---

### posted_at

LinkedIn posting timestamp.

Example:

```
2026-06-07T08:15:00Z
```

The timestamp represents the posting time of the job on LinkedIn.

---

# Step 8 - Job Deduplication

Before inserting:

System checks:

```
job_link
```

inside:

```
jobs
```

table.

---

## Case 1 - Job Does Not Exist

A new job row is created.

Database generates:

```
job_uuid
```

The current user_id is added to:

```
user_ids
```

list.

---

## Case 2 - Job Already Exists

Example:

```
AI Engineer
```

and

```
Machine Learning Engineer
```

both discover the same job.

Instead of creating another row:

System updates:

```
user_ids
```

inside existing job.

Example:

Before:

```json
{
    "user_ids": [
        "user_1"
    ]
}
```

After:

```json
{
    "user_ids": [
        "user_1",
        "user_2"
    ]
}
```

No duplicate rows are created.

---

# Step 9 - Initial Job Storage

Newly discovered jobs are stored.

Initial values:

```json
{
    "job_uuid": "...",

    "job_link": "...",

    "posted_at": "...",

    "description": null,

    "description_flags": null,

    "is_selected": null,

    "contact_found": null,

    "user_ids": [
        "user_1"
    ]
}
```

At this stage:

Only discovery is complete.

Analysis has not started yet.

---

# Step 10 - Description Extraction Phase

After keyword processing completes:

System begins:

```
Description Extraction
```

A new loop starts.

Each stored job is processed.

---

## Description Retrieval

Using:

```
job_link
```

Playwright opens the LinkedIn job page.

Full description text is extracted.

Example:

```
We are looking for an AI Engineer...

Experience: 0-2 years

Send resumes to hr@company.com
```

The description is stored in:

```
description
```

column.

---

# Step 11 - Description Analysis

The description is read once.

During the same read:

System searches for:

```
0

year
years

YOE

Experience

@

Phone Number
```

Everything is detected in a single pass.

---

# Step 12 - Phone Number Detection

Phone numbers may appear in multiple formats.

Examples:

```
9893981234
```

```
98939 81234
```

```
98 93 98 12 34
```

```
+91 98 93 98 12 34
```

All valid formats should be detected.

---

# Step 13 - Generate Description Flags

Results are stored as JSON.

Example:

```json
{
    "contains_zero": true,

    "contains_years": true,

    "contains_experience": false,

    "contains_yoe": false
}
```

Stored in:

```
description_flags
```

column.

---

# Step 14 - Contact Detection

System checks:

```
@
```

and

```
phone number
```

If either exists:

```
contact_found = TRUE
```

Otherwise:

```
contact_found = FALSE
```

Stored in:

```
contact_found
```

column.

---

# Step 15 - Job Selection Logic

The system determines whether the job is suitable.

Logic:

```python
if contains_years:
    if contains_zero:
        selected = True
    else:
        if contains_experience:
            selected = False
        else:
            selected = True

elif contains_yoe:
    if contains_zero:
        selected = True
    else:
        selected = False

else:
    selected = True
```

Result stored in:

```
is_selected
```

column.

Possible values:

```
TRUE
FALSE
```

---

# Step 16 - Update Job Record

After analysis:

Job row becomes:

```json
{
    "job_uuid": "job_123",

    "job_link": "https://linkedin.com/jobs/view/123",

    "posted_at": "2026-06-07T08:15:00Z",

    "description": "Full job description",

    "description_flags": {
        "contains_zero": true,
        "contains_years": true,
        "contains_experience": true,
        "contains_yoe": false
    },

    "is_selected": true,

    "contact_found": true,

    "user_ids": [
        "user_1",
        "user_5"
    ]
}
```

---

# Step 17 - Job Availability

After processing:

Every job now contains:

* Job Link
* Posting Timestamp
* Description
* Analysis Flags
* Contact Status
* Selection Status
* Associated Users

The job is now ready for future:
