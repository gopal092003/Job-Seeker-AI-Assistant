// src/lib/validators/internship.ts

import { z } from "zod";

export const internshipSchema = z.object({
  company: z.string().uuid(
    "Invalid company id",
  ),

  designation: z
    .string()
    .trim()
    .max(
      200,
      "Designation must be less than 200 characters",
    )
    .nullable()
    .optional(),

  description: z
    .string()
    .trim()
    .max(
      5000,
      "Description must be less than 5000 characters",
    )
    .nullable()
    .optional(),

  startDate: z
    .string()
    .date()
    .nullable()
    .optional(),

  endDate: z
    .string()
    .date()
    .nullable()
    .optional(),
});

export type InternshipSchema = z.infer<
  typeof internshipSchema
>;