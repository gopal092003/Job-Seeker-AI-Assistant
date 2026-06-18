// src/lib/validators/education.ts

import { z } from "zod";

export const educationSchema = z.object({
  institution: z
    .string()
    .trim()
    .min(
      2,
      "Institution must be at least 2 characters",
    )
    .max(
      300,
      "Institution must be less than 300 characters",
    ),

  degree: z
    .string()
    .trim()
    .min(
      2,
      "Degree must be at least 2 characters",
    )
    .max(
      200,
      "Degree must be less than 200 characters",
    ),

  specialization: z
    .string()
    .trim()
    .min(
      2,
      "Specialization must be at least 2 characters",
    )
    .max(
      200,
      "Specialization must be less than 200 characters",
    ),

  grade: z
    .string()
    .trim()
    .min(
      1,
      "Grade is required",
    )
    .max(
      50,
      "Grade must be less than 50 characters",
    ),

  additional_notes: z
    .string()
    .trim()
    .max(
      5000,
      "Additional notes must be less than 5000 characters",
    )
    .optional()
    .default(""),
});

export type EducationSchema = z.infer<
  typeof educationSchema
>;