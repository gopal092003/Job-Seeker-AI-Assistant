// src/lib/validators/keyword.ts

import { z } from "zod";

export const keywordSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Keyword must be at least 2 characters",
    )
    .max(
      100,
      "Keyword must be less than 100 characters",
    ),
});

export type KeywordSchema = z.infer<
  typeof keywordSchema
>;