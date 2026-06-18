// src/lib/validators/project.ts

import { z } from "zod";

export const projectSchema = z.object({
  project_links: z
    .array(
      z
        .string()
        .trim()
        .url("Each project link must be a valid URL"),
    )
    .min(1, "At least one project link is required"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(
      5000,
      "Description must be less than 5000 characters",
    ),
});

export type ProjectSchema = z.infer<
  typeof projectSchema
>;