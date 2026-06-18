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

  handles: HandleRow[];

  agent_status?: boolean;

  last_run_at?: string | null;
  next_run_at?: string | null;

  settings?: Record<
    string,
    unknown
  >;

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

  user_id: string;

  title: string;

  links: string[];

  description: string;

  skills: string[];

  created_at: string;
  updated_at: string;
};

export type InternshipRow = {
  internship: string;

  user_id: string;

  company: string;

  designation: string;

  start_date?:
    | string
    | null;

  end_date?:
    | string
    | null;

  links?: string[];

  description: string;

  created_at: string;
  updated_at: string;
};

export type EducationRow = {
  education: string;

  user_id: string;

  institute: string;

  degree: string;

  specialization?:
    | string
    | null;

  cgpa?:
    | number
    | null;

  grade?:
    | string
    | null;

  start_date?:
    | string
    | null;

  end_date?:
    | string
    | null;

  additional_notes?:
    | string
    | null;

  created_at: string;
  updated_at: string;
};

export type AchievementRow = {
  achievement: string;

  user_id: string;

  description: string;

  proof?:
    | string
    | null;

  date?:
    | string
    | null;

  created_at: string;
  updated_at: string;
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
  job_uuid: string;

  user_id: string;

  job_link: string;

  posted_at: string;

  description: string;

  contact_found: boolean;

  is_selected: boolean;

  created_at?: string;
  updated_at?: string;
};

export type ResumeRow = {
  resume_id: string;

  user_id: string;

  job_uuid?: string;

  job_link: string;

  resume_url: string;

  created_at: string;

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

  metadata?: Record<
    string,
    unknown
  >;

  created_at: string;

  updated_at?: string;
};