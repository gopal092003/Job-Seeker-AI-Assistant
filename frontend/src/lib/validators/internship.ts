// src/lib/validators/internship.ts

import { z } from "zod";

export const internshipSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(
      2,
      "Company name must be at least 2 characters",
    )
    .max(
      200,
      "Company name must be less than 200 characters",
    ),

  role: z
    .string()
    .trim()
    .min(
      2,
      "Role must be at least 2 characters",
    )
    .max(
      200,
      "Role must be less than 200 characters",
    ),

  internship_links: z
    .array(
      z
        .string()
        .trim()
        .url(
          "Each internship link must be a valid URL",
        ),
    )
    .min(
      1,
      "At least one internship link is required",
    ),

  description: z
    .string()
    .trim()
    .min(
      10,
      "Description must be at least 10 characters",
    )
    .max(
      5000,
      "Description must be less than 5000 characters",
    ),
});

export type InternshipSchema = z.infer<
  typeof internshipSchema
>;