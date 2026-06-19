// src/lib/validators/profile.ts

import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Name must be at least 2 characters",
    )
    .max(
      100,
      "Name must be less than 100 characters",
    ),

  email: z
    .string()
    .trim()
    .email(
      "Please enter a valid email address",
    ),
});

export type ProfileSchema =
  z.infer<typeof profileSchema>;