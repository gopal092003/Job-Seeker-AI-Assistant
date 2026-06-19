// src/lib/constants.ts

/* =======================================================
   PROFILE
   ======================================================= */

   export const MAX_INITIAL_KEYWORDS = 20;

   export const MIN_KEYWORDS_REQUIRED = 1;
   
   export const PROFILE_SECTIONS = [
     "keywords",
     "projects",
     "internships",
     "education",
     "achievements",
     "handles",
   ] as const;
   
   /* =======================================================
      HANDLES (stored in profiles.handles JSONB)
      ======================================================= */
   
   export const HANDLE_TYPES = [
     "GitHub",
     "LinkedIn",
     "Portfolio",
     "LeetCode",
     "HackerRank",
     "Codeforces",
     "CodeChef",
     "Kaggle",
     "GeeksforGeeks",
   ] as const;
   
   /* =======================================================
      ROUTES
      ======================================================= */
   
   export const ROUTES = {
     HOME: "/",
   
     LOGIN: "/login",
     REGISTER: "/register",
     VERIFY_EMAIL: "/verify-email",
   
     PROFILE: "/profile",
   
     JOBS: "/jobs",
     RESUMES: "/resumes",
   
     SETTINGS: "/settings",
   } as const;
   
   /* =======================================================
      JOBS
      ======================================================= */
   
   export const DEFAULT_SCROLL_PAGE_SIZE = 20;
   
   /* =======================================================
      OPTIONAL
      Remove if not used anywhere in the app.
      ======================================================= */
   
   export const AGENT_STATUS = {
     RUNNING: "running",
     STOPPED: "stopped",
   } as const;
   
   export type AgentStatus =
     (typeof AGENT_STATUS)[keyof typeof AGENT_STATUS];
   
   /* =======================================================
      TYPES
      ======================================================= */
   
   export type ProfileSection =
     (typeof PROFILE_SECTIONS)[number];
   
   export type HandleType =
     (typeof HANDLE_TYPES)[number];