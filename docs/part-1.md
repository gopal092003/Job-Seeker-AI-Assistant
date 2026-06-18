# Part 1 - User Authentication, Profile Creation & Profile Management System

## Overview

Part 1 covers:

* User Authentication
* User Registration
* Profile Creation
* Profile Management
* Keywords Management
* Projects Management
* Internship Management
* Education Management
* Handles Management
* Achievements Management
* Dynamic Saving
* Settings Management

The objective of Part 1 is to allow users to build and maintain a complete professional profile before they start the Job Search Agent.

---

# Step 1 - User Registration

Users can create an account using:

### Method 1 - Email & Password

User enters:

* User Name
* Email Address
* Password

When the user clicks:

```
Create Account
```

the following actions occur:

### Supabase Authentication

A user record is created inside:

```
auth.users
```

managed by Supabase.

Supabase automatically handles:

* Authentication
* Session Management
* Email Verification
* Password Recovery
* User Identification

### Email Verification

If the user signs up using Email & Password:

* Verification email is sent.
* User must verify email.
* Account remains inactive until verification succeeds.

Only after successful verification:

* User can login.
* User can access Profile Page.

---

### Method 2 - OAuth Authentication

Initially:

```
Google
```

Future providers:

```
Github
LinkedIn
```

OAuth users are authenticated through the provider and can access the platform immediately after successful login.

---

# Step 2 - Profile Row Creation

Immediately after successful registration:

A profile row is created.

Table:

```
profiles
```

Initial values:

```json id="i9k1ab"
{
    "user_id": "...",

    "user_name": "John Doe",

    "email": "john@example.com",

    "keyword_ids": [],

    "project_ids": [],

    "internship_ids": [],

    "education_ids": [],

    "handle_ids": [],

    "achievement_ids": [],

    "agent_status": false
}
```

Only:

```
user_name
email
```

are filled initially.

Everything else remains empty.

---

# Step 3 - Profile Page

After login:

User lands on:

```
Profile Page
```

This page acts as the central dashboard for profile management.

---

# Profile Header Section

Displayed at the top.

Contains:

```
User Name

Email Address

Start Agent / Stop Agent Button

Settings Button
```

---

## Start Agent Button

Initially:

```
Disabled
```

until at least one keyword exists.

Once the user adds at least one keyword:

```
Enabled
```

---

## Stop Agent Button

Only visible when:

```
agent_status = true
```

---

# Settings Button

Position:

```
Top Right Corner
```

Clicking opens:

```
Settings Page
```

---

# Step 4 - Keywords Section

Purpose:

Store all job roles the user wants the agent to search for.

Examples:

```
AI Engineer
Machine Learning Engineer
Data Scientist
Software Engineer
Python Developer
```

Keywords are shared globally across the platform.

---

## Keywords UI

Section Header:

```
Keywords
```

Top Right:

```
+
```

Button.

Clicking:

```
Add Keyword
```

opens keyword input.

---

## Saving Keywords

User enters:

```
AI Engineer
```

and clicks:

```
Save
```

---

## Keyword Processing

System checks:

```
keywords table
```

for existing keyword.

### Case 1 - Keyword Exists

System:

* Adds current user_id to user_ids.
* Adds existing keyword_id to user's keyword_ids list.

### Case 2 - Keyword Does Not Exist

System:

* Generates keyword_id.
* Creates new row.
* Adds current user_id into user_ids.
* Adds keyword_id to user's keyword_ids list.

---

## Keyword Deletion

Deleting a keyword:

* Removes keyword_id from user's profile.
* Removes user_id from keyword's user_ids list.
* If no users remain associated with that keyword, the keyword row may optionally be deleted.

---

# Step 5 - Projects Section

Purpose:

Store projects built by the user.

Projects help represent actual skills and practical work done by the candidate.

---

## Projects UI

Displayed as cards.

Each card contains:

```
Project Link(s)

Detailed Description
```

Top Right:

```
+
```

for adding a project.

---

## Project Creation

User enters:

```
Project Link(s)

Detailed Description
```

Description may contain:

```
100 tokens
1000 tokens
5000+ tokens
```

No strict limit imposed.

---

## Project Saving

System:

* Generates project_id.
* Adds project_id to profile.project_ids.
* Creates row in projects table.

Projects Table:

```
project_id

user_id

project_links

description
```

---

## Project Deletion

Deleting a project:

* Removes project_id from profile.
* Removes project row.

---

# Step 6 - Internships Section

Purpose:

Store internship experiences completed by the user.

Internships are treated similarly to projects because detailed work descriptions provide strong signals about candidate skills.

---

## Internships UI

Displayed as cards.

Each card contains:

```
Company Name

Internship Role

Internship Link(s) (Optional)

Detailed Description
```

Top Right:

```
+
```

for adding an internship.

---

## Internship Creation

User enters:

```
Company Name

Role

Internship Link(s)

Detailed Description
```

Description can contain:

```
Responsibilities

Technologies Used

Projects Worked On

Achievements During Internship
```

and may be thousands of tokens long.

---

## Internship Saving

System:

* Generates internship_id.
* Adds internship_id to profile.internship_ids.
* Creates row in internships table.

Internships Table:

```
internship_id

user_id

company_name

role

internship_links

description
```

---

## Internship Deletion

Deleting an internship:

* Removes internship_id from profile.
* Removes internship row.

---

# Step 7 - Education Section

Purpose:

Store educational history.

Users can provide as much or as little information as they wish.

A user may have:

* School Education
* Diploma
* Undergraduate Degree
* Postgraduate Degree
* Multiple Degrees

Each education entry is stored independently.

---

## Education UI

Displayed as cards.

Each card contains:

```
University / Institution

Degree

Specialization

Grade / CGPA / Percentage

Additional Notes
```

Top Right:

```
+
```

for adding education.

---

## Education Creation

User may enter:

```
Institution:
IIT Delhi

Degree:
B.Tech

Specialization:
Computer Science

Grade:
8.7 CGPA
```

or any subset of fields.

All fields are optional except Institution.

---

## Education Saving

System:

* Generates education_id.
* Adds education_id to profile.education_ids.
* Creates row in education table.

Education Table:

```
education_id

user_id

institution

degree

specialization

grade

additional_notes
```

---

## Education Deletion

Deleting an education record:

* Removes education_id from profile.
* Removes education row.

---

# Step 8 - Handles Section

Purpose:

Store professional profiles.

Examples:

```
Github

LinkedIn

Kaggle

Portfolio

LeetCode

HackerRank
```

---

## Handle Creation

User enters:

```
Handle Name

Handle URL
```

System:

* Generates handle_id.
* Stores handle_id in profile.
* Creates row in handles table.

Handles Table:

```
handle_id

user_id

handle_name

handle_link
```

---

# Step 9 - Achievements Section

Purpose:

Store notable accomplishments.

Examples:

```
Hackathon Wins

Research Papers

Competition Rankings

Certificates

Awards
```

---

## Achievement Creation

User enters:

```
Achievement Description

Achievement Proof
```

Proof may be:

```
Link

Certificate

Document

Screenshot
```

System:

* Generates achievement_id.
* Adds achievement_id to profile.
* Creates achievement row.

Achievements Table:

```
achievement_id

user_id

achievement_description

achievement_proof
```

---

# Step 10 - Dynamic Saving System

The platform does not use:

```
Save Profile
```

Instead every section is independently saved.

Examples:

```
Save Keyword

Save Project

Save Internship

Save Education

Save Handle

Save Achievement
```

Benefits:

* Faster updates
* Less data loss
* Smaller requests
* Better user experience

---

# Step 11 - Dynamic Loading

Every section has a maximum display height.

If the number of items exceeds available space:

Section becomes scrollable.

Examples:

```
50 Projects

20 Internships

15 Education Records

100 Achievements
```

Only a few items are loaded initially.

Additional items load while scrolling.

---

# Step 12 - Settings Page

Accessible from:

```
Settings Icon
```

Contains:

### Back

Returns user to Profile Page.

### Change Email

User enters:

```
New Email
```

Verification process initiated.

### Change Password

Methods:

```
Current Password
```

or

```
OTP Verification
```

### Delete Account

Danger Zone.

User must confirm.

Possible confirmation:

```
Type DELETE to continue.
```

Deleting account removes:

* Profile
* Keyword Associations
* Projects
* Internships
* Education Records
* Handles
* Achievements
* Future Agent Configurations
* Supabase Auth Account

---

# End State Of Part 1

After completing Part 1:

User has:

* Authenticated Account
* Profile Record
* Keywords
* Projects
* Internships
* Education History
* Handles
* Achievements

The profile is now ready for:

```
Part 2 - Agent Execution & Job Discovery
```

where the Start Agent button becomes functional.
