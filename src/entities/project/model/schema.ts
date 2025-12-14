import { z } from "zod";

export const boardSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수 입력 항목입니다." }),
  description: z.string().optional(),
});

export type BoardFormInput = z.input<typeof boardSchema>;
export type BoardFormOutput = z.output<typeof boardSchema>;
