// src/types/profile.ts

import type {
  ProfileRow,
  KeywordRow,
} from "@/types/database";

export type AgentSettings = {
  activeStartTime: string;

  activeEndTime: string;

  frequency: number;
};

export type Project = {
  id: string;

  title: string;

  links: string[];

  description: string;

  skills: string[];

  createdAt?: string;
  updatedAt?: string;
};

export type Internship = {
  id: string;

  company: string;

  companyName?: string;

  designation: string;

  description: string;

  startDate?: string | null;

  endDate?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

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

export type Achievement = {
  id: string;

  description: string;

  proof: string;

  createdAt?: string;
  updatedAt?: string;
};

export type Handle = {
  id: string;

  platform: string;

  url: string;

  createdAt?: string;
  updatedAt?: string;
};

export type Profile = {
  id: string;

  name: string;

  email: string;

  educationIds: string[];

  keywordIds: string[];

  projectIds: string[];

  internshipIds: string[];

  achievementIds: string[];

  handles: ProfileRow["handles"];
};

export type Keyword = {
  id: string;

  value: string;

  userCount: number;
};

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
      profile.handles ?? {},
  };
}

export function mapKeywordRow(
  keyword: KeywordRow,
): Keyword {
  return {
    id: keyword.keyword,

    value: keyword.name,

    userCount:
      keyword.user_ids?.length ?? 0,
  };
}