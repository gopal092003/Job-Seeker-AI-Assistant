// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { MIN_KEYWORDS_REQUIRED } from "@/lib/constants";

/* =======================================================
   STYLING
   ======================================================= */

export function cn(
  ...inputs: ClassValue[]
): string {
  return twMerge(clsx(inputs));
}

/* =======================================================
   PROFILE VALIDATION
   ======================================================= */

/**
 * Checks whether a user has at least one keyword.
 */
export function hasKeywords(
  keywords: string[] | null | undefined,
): boolean {
  return (keywords?.length ?? 0) > 0;
}

/**
 * Determines whether the profile has enough
 * keywords for job matching.
 */
export function isProfileReady(
  keywordCount: number,
): boolean {
  return keywordCount >= MIN_KEYWORDS_REQUIRED;
}

/**
 * Checks whether all required profile
 * fields are present.
 */
export function isProfileComplete({
  name,
  email,
  keywordCount,
}: {
  name?: string | null;
  email?: string | null;
  keywordCount: number;
}): boolean {
  return (
    !!name &&
    !!email &&
    keywordCount >=
      MIN_KEYWORDS_REQUIRED
  );
}

/* =======================================================
   ERROR HANDLING
   ======================================================= */

/**
 * Converts unknown errors into
 * user-friendly messages.
 */
export function formatError(
  error: unknown,
): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}