import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수 입력 항목입니다." }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  // 콤마로 구분된 문자열 → 배열로 변환
  tags: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : []
  ),
  assignee: z.string().optional(),
  dueDate: z.date().optional(),
});

// 폼 입력 타입 (transform 전)
export type TaskFormInput = z.input<typeof taskSchema>;

// 출력 타입 (transform 후)
export type TaskFormOutput = z.output<typeof taskSchema>;
