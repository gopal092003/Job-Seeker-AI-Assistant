// src/lib/validators/achievement.ts

import { z } from "zod";

export const achievementSchema = z.object({
  description: z
    .string()
    .trim()
    .min(
      10,
      "Achievement description must be at least 10 characters",
    )
    .max(
      5000,
      "Achievement description must be less than 5000 characters",
    ),

  proof: z
    .string()
    .trim()
    .url(
      "Achievement proof must be a valid URL",
    )
    .optional()
    .or(z.literal("")),

  date: z
    .string()
    .optional()
    .nullable(),
});

export type AchievementSchema = z.infer<
  typeof achievementSchema
>;