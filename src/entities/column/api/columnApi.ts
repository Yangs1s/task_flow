import { supabase } from "@/src/shared/lib/supabase";
import { Column } from "../model/types";

export const columnApi = {
  getColumns: async (projectId: string): Promise<Column[]> => {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    if (error) throw error;

    console.log("data :", data);
    return data.map(mapColumnFromDb);
  },

  createColumn: async (
    column: Omit<Column, "id" | "createdAt" | "updatedAt">
  ): Promise<Column> => {
    const { data, error } = await supabase
      .from("columns")
      .insert(mapColumnToDb(column))
      .select()
      .single();
    if (error) throw error;
    return mapColumnFromDb(data);
  },

  updateColumn: async (
    id: string,
    updates: Partial<Column>
  ): Promise<Column> => {
    const { data, error } = await supabase
      .from("columns")
      .update(mapColumnToDb(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapColumnFromDb(data);
  },

  deleteColumn: async (id: string): Promise<void> => {
    const { error } = await supabase.from("columns").delete().eq("id", id);
    if (error) throw error;
  },
};

// DB 컬럼명 (snake_case) -> 프론트 타입 (camelCase)
const mapColumnFromDb = (dbColumn: Record<string, unknown>): Column => ({
  id: dbColumn.id as string,
  title: dbColumn.title as string,
  boardId: dbColumn.board_id as string,
  order: dbColumn.order as number,
  color: dbColumn.color as string | undefined,
  taskLimit: dbColumn.task_limit as number | undefined,
  createdAt: new Date(dbColumn.created_at as string),
  updatedAt: new Date(dbColumn.updated_at as string),
});

// 프론트 타입 (camelCase) -> DB 컬럼명 (snake_case)
const mapColumnToDb = (column: Partial<Column>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (column.title !== undefined) result.title = column.title;
  if (column.boardId !== undefined) result.board_id = column.boardId;
  if (column.order !== undefined) result.order = column.order;
  if (column.color !== undefined) result.color = column.color;
  if (column.taskLimit !== undefined) result.task_limit = column.taskLimit;
  return result;
};
