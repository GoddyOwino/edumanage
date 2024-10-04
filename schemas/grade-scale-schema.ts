import { z } from "zod";
const ExamTypeEnum = z.enum([
  "MIDTERM",
  "END_TERM",
  "MOCK",
  "FINAL",
  "ASSIGNMENT",
  "QUIZ",
  "NATIONAL",
]);

export const gradeScaleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  letterGrade: z.string().min(1, { message: "Letter Grade is required" }),
  minScore: z.coerce
    .number()
    .min(0, { message: "Minimum score must be a positive number" })
    .refine((value) => value % 1 !== 0 || value >= 0, {
      message: "Minimum score must be a decimal or whole number",
    }),
  maxScore: z.coerce
    .number()
    .min(0, { message: "Maximum score must be a positive number" })
    .refine((value) => value % 1 !== 0 || value >= 0, {
      message: "Maximum score must be a decimal or whole number",
    }),
  gpa: z.coerce
    .number()
    .nullable()
    .optional()
    .refine(
      (value) => value === null || (typeof value === "number" && value >= 0),
      {
        message: "GPA must be a positive number or null",
      }
    ),
  description: z.string().optional(),
  schoolId: z.string().nullable().optional(),
  subjectId: z.number().nullable().optional(),
  examType: ExamTypeEnum.nullable().optional(),
  isDefault: z.boolean().optional(),
});

export type GradeScaleSchema = z.infer<typeof gradeScaleSchema>;
