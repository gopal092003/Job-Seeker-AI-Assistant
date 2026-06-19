// src/types/jobs.ts

export interface Job {
  user_id: string;

  job_link: string;

  posted_time: string | null;

  description: string | null;

  mail: boolean;

  number: boolean;

  contains_zero: boolean;

  contains_yoe: boolean;

  contains_year: boolean;

  contains_experience: boolean;

  skills: string[];

  selected: boolean;
}

export interface JobFlags {
  mail?: boolean;

  number?: boolean;

  selected?: boolean;

  contains_zero?: boolean;

  contains_yoe?: boolean;

  contains_year?: boolean;

  contains_experience?: boolean;
}

export type JobStatus =
  | "new"
  | "contact_available"
  | "selected"
  | "filtered";