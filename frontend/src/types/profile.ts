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

  projectLinks: string[];

  description: string;

  createdAt?: string;
  updatedAt?: string;
};

export type Internship = {
  id: string;

  companyName: string;

  role: string;

  links: string[];

  description: string;

  createdAt?: string;
  updatedAt?: string;
};

export type Education = {
  id: string;

  institution: string;

  degree: string;

  specialization: string;

  grade: string;

  additionalNotes: string;

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

  user_name: string;

  email: string;

  educationIds: string[];

  keywordIds: string[];

  projectIds: string[];

  internshipIds: string[];

  achievementIds: string[];

  handles: ProfileRow["handles"];

  agentStatus: boolean;
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
      profile.education,

    keywordIds:
      profile.keywords,

    projectIds:
      profile.projects,

    internshipIds:
      profile.intern,

    achievementIds:
      profile.achievements,

    handles:
      profile.handles,

    agentStatus:
      profile.agent_status ??
      false,
  };
}

export function mapKeywordRow(
  keyword: KeywordRow,
): Keyword {
  return {
    id: keyword.keyword,

    value: keyword.name,

    userCount:
      keyword.user_ids
        ?.length ?? 0,
  };
}