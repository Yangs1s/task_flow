import { supabase } from "@/src/shared/lib/supabase";
import { Project } from "../model/types";

/**
 * Project API
 * Supabase와 통신하여 프로젝트 데이터를 관리하는 API 모듈
 */
export const projectApi = {
  /**
   * 모든 프로젝트 조회
   * @returns 프로젝트 목록 (생성일 내림차순 정렬)
   * @throws Supabase 에러 발생 시 throw
   */
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(mapProjectFromDb);
  },

  /**
   * 특정 프로젝트 조회
   * @param id - 프로젝트 ID
   * @returns 프로젝트 데이터
   * @throws Supabase 에러 발생 시 throw
   */
  getProject: async (id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  /**
   * 새 프로젝트 생성
   * @param project - 생성할 프로젝트 데이터 (id, 날짜 제외)
   * @returns 생성된 프로젝트 (DB에서 반환된 데이터)
   * @throws Supabase 에러 발생 시 throw
   */
  createProject: async (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .insert(mapProjectToDb(project))
      .select()
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  /**
   * 프로젝트 정보 수정
   * @param id - 수정할 프로젝트 ID
   * @param updates - 수정할 필드들 (부분 업데이트 가능)
   * @returns 수정된 프로젝트 데이터
   * @throws Supabase 에러 발생 시 throw
   */
  updateProject: async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .update(mapProjectToDb(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  /**
   * 프로젝트 삭제
   * @param id - 삭제할 프로젝트 ID
   * @throws Supabase 에러 발생 시 throw
   */
  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },
};

/**
 * DB 데이터 → 프론트 타입 변환
 * snake_case (DB) → camelCase (프론트)
 */
const mapProjectFromDb = (dbProject: Record<string, unknown>): Project => ({
  id: dbProject.id as string,
  title: dbProject.title as string,
  description: dbProject.description as string | undefined,
  startDate: new Date(dbProject.start_date as string),
  endDate: new Date(dbProject.end_date as string),
  createdAt: new Date(dbProject.created_at as string),
  updatedAt: new Date(dbProject.updated_at as string),
});

/**
 * 프론트 타입 → DB 데이터 변환
 * camelCase (프론트) → snake_case (DB)
 */
const mapProjectToDb = (project: Partial<Project>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (project.title !== undefined) result.title = project.title;
  if (project.description !== undefined) result.description = project.description;
  if (project.startDate !== undefined)
    result.start_date = project.startDate instanceof Date 
      ? project.startDate.toISOString() 
      : project.startDate;
  if (project.endDate !== undefined)
    result.end_date = project.endDate instanceof Date 
      ? project.endDate.toISOString() 
      : project.endDate;
  return result;
};
