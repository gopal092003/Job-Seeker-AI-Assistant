```
job-search-agent/
├── database/
│   ├── supabase-migration.sql             # combined migration file
│   │
│   ├── schema/
│   │   ├── profiles.sql
│   │   ├── education.sql
│   │   ├── degrees.sql
│   │   ├── institutes.sql
│   │   ├── keywords.sql
│   │   ├── projects.sql
│   │   ├── internships.sql
│   │   ├── companies.sql
│   │   ├── achievements.sql
│   │   ├── available_jobs.sql
│   │   ├── resumes.sql
│   │   └── indexes.sql
│   │
│   ├── rls_policies.sql                   # row-level security per table
│   ├── functions.sql                      # pg functions & triggers
│   └── README.md
│
├── docs/
│   ├── overview.md                        # project summary, tech stack
│   ├── architecture.md                    # frontend + backend + db diagram
│   ├── part-1.md                          # auth & profile spec
│   ├── part-2.md                          # agent & job discovery spec
│   ├── part-3.md                          # resume & email spec
│   ├── api.md                             # all API routes documented
│   ├── env.md                             # all env vars explained
│   ├── deployment.md                      # deployment guide
│   ├── agent-logic.md                     # job selection logic
│   └── resume-pipeline.md                 # llm → latex → pdf flow
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                 # root layout, session provider
│   │   │   ├── page.tsx                   # landing / redirect to /profile
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verify-email/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── resumes/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   └── route.ts
│   │   │       ├── profile/
│   │   │       │   └── route.ts
│   │   │       ├── keywords/
│   │   │       │   └── route.ts
│   │   │       ├── projects/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── internships/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── education/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── achievements/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── handles/
│   │   │       │   └── route.ts
│   │   │       ├── agent/
│   │   │       │   ├── start/
│   │   │       │   │   └── route.ts
│   │   │       │   ├── stop/
│   │   │       │   │   └── route.ts
│   │   │       │   └── status/
│   │   │       │       └── route.ts
│   │   │       ├── jobs/
│   │   │       │   └── route.ts
│   │   │       ├── resumes/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       └── webhooks/
│   │   │           └── agent-cycle/
│   │   │               └── route.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   └── toast.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── google-button.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── profile-header.tsx
│   │   │   │   ├── agent-button.tsx
│   │   │   │   ├── keywords-section.tsx
│   │   │   │   ├── keyword-card.tsx
│   │   │   │   ├── keyword-form.tsx
│   │   │   │   ├── projects-section.tsx
│   │   │   │   ├── project-card.tsx
│   │   │   │   ├── project-form.tsx
│   │   │   │   ├── internships-section.tsx
│   │   │   │   ├── internship-card.tsx
│   │   │   │   ├── internship-form.tsx
│   │   │   │   ├── education-section.tsx
│   │   │   │   ├── education-card.tsx
│   │   │   │   ├── education-form.tsx
│   │   │   │   ├── achievements-section.tsx
│   │   │   │   ├── achievement-card.tsx
│   │   │   │   ├── achievement-form.tsx
│   │   │   │   ├── handles-section.tsx
│   │   │   │   ├── handle-item.tsx
│   │   │   │   └── handle-form.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── change-email-form.tsx
│   │   │   │   ├── change-password-form.tsx
│   │   │   │   └── delete-account-dialog.tsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── job-card.tsx
│   │   │   │   ├── jobs-list.tsx
│   │   │   │   └── job-filters.tsx
│   │   │   │
│   │   │   ├── resumes/
│   │   │   │   ├── resume-card.tsx
│   │   │   │   └── resumes-list.tsx
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── navbar.tsx
│   │   │       └── page-shell.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-profile.ts
│   │   │   ├── use-keywords.ts
│   │   │   ├── use-projects.ts
│   │   │   ├── use-internships.ts
│   │   │   ├── use-education.ts
│   │   │   ├── use-achievements.ts
│   │   │   ├── use-handles.ts
│   │   │   ├── use-jobs.ts
│   │   │   ├── use-agent-status.ts
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts
│   │   │   │   ├── server.ts
│   │   │   │   └── middleware.ts
│   │   │   ├── validators/
│   │   │   │   ├── profile.ts
│   │   │   │   ├── keyword.ts
│   │   │   │   ├── project.ts
│   │   │   │   ├── internship.ts
│   │   │   │   ├── education.ts
│   │   │   │   └── achievement.ts
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── types/
│   │   │   ├── database.ts
│   │   │   ├── profile.ts
│   │   │   └── jobs.ts
│   │   │
│   │   └── middleware.ts
│   │
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── keyword-form.test.tsx
│   │   │   ├── project-form.test.tsx
│   │   │   ├── agent-button.test.tsx
│   │   │   └── delete-account-dialog.test.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── keywords.test.ts
│   │   │   ├── projects.test.ts
│   │   │   └── agent.test.ts
│   │   │
│   │   └── hooks/
│   │       ├── use-agent-status.test.ts
│   │       └── use-profile.test.ts
│   │
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── package.json
│   └── .env.local
│
├── backend/
│   ├── agent/
│   │   ├── runner.py
│   │   ├── scheduler.py
│   │   └── deduplicator.py
│   │
│   ├── scraper/
│   │   ├── linkedin.py
│   │   ├── extractor.py
│   │   ├── description_fetcher.py
│   │   └── browser_pool.py
│   │
│   ├── analyzer/
│   │   ├── flags.py
│   │   ├── phone_detector.py
│   │   ├── email_detector.py
│   │   └── selector.py
│   │
│   ├── resume/
│   │   ├── llm_call_1.py
│   │   ├── llm_call_2.py
│   │   ├── latex_builder.py
│   │   ├── pdf_compiler.py
│   │   └── storage.py
│   │
│   ├── email/
│   │   ├── composer.py
│   │   ├── sender.py
│   │   └── templates/
│   │       └── job_digest.html
│   │
│   ├── db/
│   │   ├── client.py
│   │   ├── profiles.py
│   │   ├── keywords.py
│   │   ├── jobs.py
│   │   ├── resumes.py
│   │   ├── degrees.py
│   │   ├── institutes.py
│   │   └── companies.py
│   │
│   ├── latex_templates/
│   │   ├── resume_base.tex
│   │   └── sections/
│   │       ├── skills.tex
│   │       ├── projects.tex
│   │       ├── internships.tex
│   │       ├── achievements.tex
│   │       ├── education.tex
│   │       └── handles.tex
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── test_flags.py
│   │   │   ├── test_phone_detector.py
│   │   │   ├── test_email_detector.py
│   │   │   ├── test_selector.py
│   │   │   ├── test_scheduler.py
│   │   │   ├── test_deduplicator.py
│   │   │   └── test_latex_builder.py
│   │   │
│   │   ├── integration/
│   │   │   ├── test_job_pipeline.py
│   │   │   ├── test_resume_pipeline.py
│   │   │   ├── test_email_pipeline.py
│   │   │   ├── test_db_keywords.py
│   │   │   └── test_db_jobs.py
│   │   │
│   │   └── conftest.py
│   │
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   └── .env
│
├── .gitignore
├── README.md
└── docker-compose.yml
```