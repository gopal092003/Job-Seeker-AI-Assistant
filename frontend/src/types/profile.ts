// src/types/profile.ts

import type {
  ProfileRow,
  KeywordRow,
} from "@/types/database";

/* =======================================================
   PROJECT
   ======================================================= */

export type Project = {
  id: string;

  title: string;

  links: string[];

  description: string | null;

  skills: string[];

  createdAt?: string;
  updatedAt?: string;
};

/* =======================================================
   INTERNSHIP
   ======================================================= */

export type Internship = {
  id: string;

  company: string;

  companyName?: string;

  designation: string | null;

  description: string | null;

  startDate?: string | null;
  endDate?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

/* =======================================================
   EDUCATION
   ======================================================= */

export type Education = {
  id: string;

  degree: string;

  institute: string;

  degreeName?: string;

  instituteName?: string;

  cgpa: number | null;

  startDate?: string | null;
  endDate?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

/* =======================================================
   ACHIEVEMENT
   ======================================================= */

export type Achievement = {
  id: string;

  description: string | null;

  proof: string | null;

  date?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

/* =======================================================
   PROFILE
   ======================================================= */

export type Profile = {
  id: string;

  name: string;

  email: string;

  educationIds: string[];

  keywordIds: string[];

  projectIds: string[];

  internshipIds: string[];

  achievementIds: string[];

  handles: Record<string, string>;
};

/* =======================================================
   KEYWORD
   ======================================================= */

export type Keyword = {
  id: string;

  value: string;
};

/* =======================================================
   HANDLES
   ======================================================= */

export type Handle = {
  platform: string;
  url: string;
};

/* =======================================================
   MAPPERS
   ======================================================= */

export function mapProfileRow(
  profile: ProfileRow,
): Profile {
  return {
    id: profile.user_id,

    name: profile.name,

    email: profile.email,

    educationIds:
      profile.education ?? [],

    keywordIds:
      profile.keywords ?? [],

    projectIds:
      profile.projects ?? [],

    internshipIds:
      profile.intern ?? [],

    achievementIds:
      profile.achievements ?? [],

    handles:
      (profile.handles as Record<
        string,
        string
      >) ?? {},
  };
}

export function mapKeywordRow(
  keyword: KeywordRow,
): Keyword {
  return {
    id: keyword.keyword,

    value: keyword.name,
  };
}