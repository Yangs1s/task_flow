import { supabase } from "@/src/shared/lib/supabase";
import { Column } from "../model/types";

/**
 * Column API
 * Supabase와 통신하여 칸반 컬럼 데이터를 관리하는 API 모듈
 */
export const columnApi = {
  /**
   * 특정 프로젝트의 컬럼 목록 조회
   * @param projectId - 프로젝트 ID
   * @returns 컬럼 목록 (order 오름차순 정렬)
   * @throws Supabase 에러 발생 시 throw
   */
  getColumns: async (projectId: string): Promise<Column[]> => {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    if (error) throw error;
    return data.map(mapColumnFromDb);
  },

  /**
   * 새 컬럼 생성
   * @param column - 생성할 컬럼 데이터 (id, 날짜 제외)
   * @returns 생성된 컬럼 (DB에서 반환된 데이터)
   * @throws Supabase 에러 발생 시 throw
   */
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

  /**
   * 컬럼 정보 수정
   * @param id - 수정할 컬럼 ID
   * @param updates - 수정할 필드들 (부분 업데이트 가능)
   * @returns 수정된 컬럼 데이터
   * @throws Supabase 에러 발생 시 throw
   */
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

  /**
   * 컬럼 삭제
   * @param id - 삭제할 컬럼 ID
   * @throws Supabase 에러 발생 시 throw
   */
  deleteColumn: async (id: string): Promise<void> => {
    const { error } = await supabase.from("columns").delete().eq("id", id);
    if (error) throw error;
  },
};

/**
 * DB 데이터 → 프론트 타입 변환
 * snake_case (DB) → camelCase (프론트)
 */
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

/**
 * 프론트 타입 → DB 데이터 변환
 * camelCase (프론트) → snake_case (DB)
 */
const mapColumnToDb = (column: Partial<Column>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (column.title !== undefined) result.title = column.title;
  if (column.boardId !== undefined) result.board_id = column.boardId;
  if (column.order !== undefined) result.order = column.order;
  if (column.color !== undefined) result.color = column.color;
  if (column.taskLimit !== undefined) result.task_limit = column.taskLimit;
  return result;
};
