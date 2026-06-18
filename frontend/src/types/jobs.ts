// src/types/jobs.ts

export interface Job {
  job_uuid: string;

  job_link: string;

  posted_at: string;

  description: string;

  contact_found: boolean;

  is_selected: boolean;
}

export interface JobFlags {
  contact_found?: boolean;

  is_selected?: boolean;
}

export type JobStatus =
  | "new"
  | "contact_found"
  | "selected"
  | "archived";

export interface JobFilterState {
  selectedOnly: boolean;

  contactOnly: boolean;

  search: string;

  status?: JobStatus;

  postedAfter?: string;

  postedBefore?: string;
}

export interface JobFilters {
  search?: string;

  contact_found?: boolean;

  is_selected?: boolean;

  posted_after?: string;

  posted_before?: string;
}