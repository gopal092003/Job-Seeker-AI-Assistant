// src/lib/validators/project.ts

import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters")
    .max(
      200,
      "Project title must be less than 200 characters",
    ),

  links: z
    .array(
      z
        .string()
        .trim()
        .url("Each project link must be a valid URL"),
    )
    .default([]),

  description: z
    .string()
    .trim()
    .max(
      5000,
      "Description must be less than 5000 characters",
    )
    .optional()
    .or(z.literal("")),

  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Skill cannot be empty"),
    )
    .default([]),
});

export type ProjectSchema = z.infer<
  typeof projectSchema
>;