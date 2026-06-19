import { z } from "zod";

export const educationSchema = z.object({
  degree: z
    .string()
    .uuid("Invalid degree ID"),

  institute: z
    .string()
    .uuid("Invalid institute ID"),

  cgpa: z
    .number()
    .min(0, "CGPA cannot be negative")
    .max(10, "CGPA cannot exceed 10")
    .optional(),

  startDate: z
    .string()
    .date()
    .optional(),

  endDate: z
    .string()
    .date()
    .optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) {
      return true;
    }

    return (
      new Date(data.startDate) <=
      new Date(data.endDate)
    );
  },
  {
    message:
      "End date must be after start date",
    path: ["endDate"],
  },
);

export type EducationInput =
  z.infer<
    typeof educationSchema
  >;