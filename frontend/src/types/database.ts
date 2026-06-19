// src/types/database.ts

export type ProfileRow = {
  user_id: string;

  name: string;
  email: string;

  education: string[];
  keywords: string[];
  projects: string[];
  intern: string[];
  achievements: string[];

  // SQL has JSONB handles
  handles: Record<string, unknown>;

  // keep these even though not in current schema
  agent_status?: boolean;
  last_run_at?: string | null;
  next_run_at?: string | null;

  settings?: Record<string, unknown>;

  created_at?: string;
  updated_at?: string;
};

export type KeywordRow = {
  keyword: string;
  name: string;

  user_ids?: string[];

  created_at?: string;
  updated_at?: string;
};

export type ProjectRow = {
  project: string;

  // keep for app-level use
  user_id: string;

  title: string;

  links: string[];

  description?: string | null;

  skills: string[];

  created_at?: string;
  updated_at?: string;
};

export type InternshipRow = {
  internship: string;

  // keep for app-level use
  user_id: string;

  company: string;

  designation?: string | null;

  start_date?: string | null;
  end_date?: string | null;

  links?: string[];

  description?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type EducationRow = {
  education: string;

  // keep for app-level use
  user_id: string;

  institute: string;
  degree: string;

  specialization?: string | null;

  cgpa?: number | null;

  grade?: string | null;

  start_date?: string | null;
  end_date?: string | null;

  additional_notes?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type AchievementRow = {
  achievement: string;

  // keep for app-level use
  user_id: string;

  description?: string | null;

  proof?: string | null;

  date?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type HandleRow = {
  handle_id: string;

  user_id: string;

  handle_name: string;
  handle_link: string;

  created_at?: string;
  updated_at?: string;
};

export type JobRow = {
  // keep existing field
  job_uuid: string;

  user_id: string;

  job_link: string;

  // SQL uses posted_time
  posted_time?: string | null;

  description?: string | null;

  // SQL has mail + number instead of contact_found
  mail?: boolean;
  number?: boolean;

  contact_found?: boolean;

  contains_zero?: boolean;
  contains_yoe?: boolean;
  contains_year?: boolean;
  contains_experience?: boolean;

  skills?: string[];

  // SQL uses selected
  selected?: boolean;

  // keep existing field
  is_selected?: boolean;

  created_at?: string;
  updated_at?: string;
};

export type ResumeRow = {
  // keep app-level fields
  resume_id: string;

  user_id: string;

  job_uuid?: string;

  job_link: string;

  resume_url?: string;

  // SQL fields
  intern?: string | null;

  project_1?: string | null;
  project_2?: string | null;
  project_3?: string | null;

  achievement?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type NotificationRow = {
  notification_id: string;

  user_id: string;

  title: string;
  message: string;

  type:
    | "job"
    | "resume"
    | "agent"
    | "system";

  is_read: boolean;

  metadata?: Record<string, unknown>;

  created_at: string;
  updated_at?: string;
};