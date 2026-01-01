import { create } from "zustand";
import { Project, ProjectInput, ProjectUpdate } from "./types";
import { generateId } from "@/src/shared/lib/generateId";
import { projectApi } from "../api/projectApi";

/**
 * Project Store 인터페이스
 * 프로젝트 상태 관리를 위한 Zustand store 타입 정의
 */
interface ProjectStore {
  /** 프로젝트 목록 */
  projects: Project[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
  /** 서버에서 프로젝트 목록 조회 */
  fetchProjects: () => Promise<void>;
  /** 새 프로젝트 추가 */
  addProject: (project: ProjectInput) => void;
  /** 프로젝트 정보 수정 */
  updateProject: (id: string, updates: ProjectUpdate) => void;
  /** 프로젝트 삭제 */
  deleteProject: (id: string) => void;
  /** ID로 프로젝트 조회 */
  getProject: (id: string) => Project | undefined;
  /** 스토어 초기화 */
  reset: () => void;
}

/**
 * Project Store
 * Zustand를 사용한 프로젝트 전역 상태 관리
 */
export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  /**
   * 서버에서 프로젝트 목록 조회
   * Supabase에서 모든 프로젝트를 가져와 상태 업데이트
   */
  fetchProjects: async () => {
    const projects = await projectApi.getProjects();
    set({ projects });
  },

  /**
   * 새 프로젝트 추가
   * @param project - 프로젝트 입력 데이터 (id, 날짜 제외)
   * - 자동으로 id, createdAt, updatedAt 생성
   */
  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: generateId("project"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ projects: [...get().projects, newProject] });
  },

  /**
   * 프로젝트 정보 수정
   * @param id - 수정할 프로젝트 ID
   * @param updates - 수정할 필드들 (부분 업데이트 가능)
   */
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
    })),

  /**
   * 프로젝트 삭제
   * @param id - 삭제할 프로젝트 ID
   */
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),

  /**
   * ID로 프로젝트 조회
   * @param id - 조회할 프로젝트 ID
   * @returns 해당 프로젝트 또는 undefined
   */
  getProject: (id) => get().projects.find((project) => project.id === id),

  /**
   * 스토어 초기화
   * 모든 프로젝트 데이터를 빈 배열로 리셋
   */
  reset: () => set({ projects: [] }),
}));
