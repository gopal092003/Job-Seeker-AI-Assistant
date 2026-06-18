// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { MIN_KEYWORDS_REQUIRED } from "@/lib/constants";

/**
 * Merge Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines whether the agent can be started.
 */
export function isAgentEnabled(keywordCount: number): boolean {
  return keywordCount >= MIN_KEYWORDS_REQUIRED;
}

/**
 * Checks whether a user has at least one keyword.
 */
export function hasKeywords(
  keywords: string[] | null | undefined,
): boolean {
  return (keywords?.length ?? 0) > 0;
}

/**
 * Converts unknown errors into user-friendly messages.
 */
export function formatError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}