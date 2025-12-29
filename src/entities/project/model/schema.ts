import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수 입력 항목입니다." }),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type ProjectFormInput = z.input<typeof projectSchema>;
export type ProjectFormOutput = z.output<typeof projectSchema>;
