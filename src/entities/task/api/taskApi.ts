import { supabase } from "@/src/shared/lib/supabase";
import { Task } from "../model/types";

export const taskApi = {
  getTasks: async (columnId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("column_id", columnId)
      .order("order", { ascending: true });
    if (error) throw error;
    return data.map(mapTaskFromDb);
  },

  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    if (error) throw error;
    return data.map(mapTaskFromDb);
  },

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

  deleteTask: async (id: string): Promise<void> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};

// DB 컬럼명 (snake_case) -> 프론트 타입 (camelCase)
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

// 프론트 타입 (camelCase) -> DB 컬럼명 (snake_case)
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
