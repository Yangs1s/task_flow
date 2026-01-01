import { supabase } from "@/src/shared/lib/supabase";
import { Task } from "../model/types";

/**
 * Task API
 * Supabase와 통신하여 태스크 데이터를 관리하는 API 모듈
 */
export const taskApi = {
  /**
   * 특정 컬럼의 태스크 목록 조회
   * @param columnId - 컬럼 ID
   * @returns 태스크 목록 (order 오름차순 정렬)
   * @throws Supabase 에러 발생 시 throw
   */
  getTasks: async (columnId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("column_id", columnId)
      .order("order", { ascending: true });
    if (error) throw error;
    return data.map(mapTaskFromDb);
  },

  /**
   * 특정 프로젝트의 모든 태스크 조회
   * @param projectId - 프로젝트 ID
   * @returns 태스크 목록 (order 오름차순 정렬)
   * @throws Supabase 에러 발생 시 throw
   */
  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    if (error) throw error;
    return data.map(mapTaskFromDb);
  },

  /**
   * 새 태스크 생성
   * @param task - 생성할 태스크 데이터 (id, 날짜 제외)
   * @returns 생성된 태스크 (DB에서 반환된 데이터)
   * @throws Supabase 에러 발생 시 throw
   */
  createTask: async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(mapTaskToDb(task))
      .select()
      .single();
    if (error) throw error;
    return mapTaskFromDb(data);
  },

  /**
   * 태스크 정보 수정
   * @param id - 수정할 태스크 ID
   * @param updates - 수정할 필드들 (부분 업데이트 가능)
   * @returns 수정된 태스크 데이터
   * @throws Supabase 에러 발생 시 throw
   */
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from("tasks")
      .update(mapTaskToDb(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapTaskFromDb(data);
  },

  /**
   * 태스크 삭제
   * @param id - 삭제할 태스크 ID
   * @throws Supabase 에러 발생 시 throw
   */
  deleteTask: async (id: string): Promise<void> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};

/**
 * DB 데이터 → 프론트 타입 변환
 * snake_case (DB) → camelCase (프론트)
 */
const mapTaskFromDb = (dbTask: Record<string, unknown>): Task => ({
  id: dbTask.id as string,
  title: dbTask.title as string,
  description: dbTask.description as string | undefined,
  priority: (dbTask.priority as Task["priority"]) || "medium",
  tags: (dbTask.tags as string[]) || [],
  assignee: dbTask.assignee as string | undefined,
  dueDate: dbTask.due_date ? new Date(dbTask.due_date as string) : undefined,
  columnId: dbTask.column_id as string,
  order: dbTask.order as number | undefined,
  createdAt: new Date(dbTask.created_at as string),
  updatedAt: new Date(dbTask.updated_at as string),
});

/**
 * 프론트 타입 → DB 데이터 변환
 * camelCase (프론트) → snake_case (DB)
 */
const mapTaskToDb = (task: Partial<Task>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (task.title !== undefined) result.title = task.title;
  if (task.description !== undefined) result.description = task.description;
  if (task.priority !== undefined) result.priority = task.priority;
  if (task.tags !== undefined) result.tags = task.tags;
  if (task.assignee !== undefined) result.assignee = task.assignee;
  if (task.dueDate !== undefined) result.due_date = task.dueDate.toISOString();
  if (task.columnId !== undefined) result.column_id = task.columnId;
  if (task.order !== undefined) result.order = task.order;
  return result;
};
