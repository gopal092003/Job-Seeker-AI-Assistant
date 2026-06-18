// src/lib/constants.ts

export const MAX_INITIAL_KEYWORDS = 20;

export const PROFILE_SECTIONS = [
  "keywords",
  "projects",
  "internships",
  "education",
  "achievements",
  "handles",
] as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",

  PROFILE: "/profile",
  SETTINGS: "/settings",

  JOBS: "/jobs",
  RESUMES: "/resumes",
} as const;

export const AGENT_STATUS = {
  RUNNING: "running",
  STOPPED: "stopped",
} as const;

export const HANDLE_TYPES = [
  "GitHub",
  "LinkedIn",
  "Kaggle",
  "Portfolio",
  "LeetCode",
  "HackerRank",
] as const;

export const DEFAULT_SCROLL_PAGE_SIZE = 20;

export const MIN_KEYWORDS_REQUIRED = 1;