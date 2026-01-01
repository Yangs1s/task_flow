import { create } from "zustand";
import { Task, TaskInput, TaskUpdate } from "./types";
import { generateId } from "@/src/shared/lib/generateId";
import { taskApi } from "../api/taskApi";

/**
 * Task Store 인터페이스
 * 태스크 상태 관리를 위한 Zustand store 타입 정의
 */
interface TaskStore {
  /** 태스크 목록 */
  tasks: Task[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
  /** 특정 컬럼의 태스크 조회 */
  fetchTasks: (columnId: string) => Promise<void>;
  /** 특정 프로젝트의 모든 태스크 조회 */
  fetchTasksByProject: (projectId: string) => Promise<void>;
  /** 새 태스크 추가 */
  addTask: (task: TaskInput) => Promise<void>;
  /** 태스크 정보 수정 */
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  /** 태스크 삭제 */
  deleteTask: (id: string) => Promise<void>;
  /** 태스크를 다른 컬럼으로 이동 */
  moveTask: (
    id: string,
    newColumnId: string,
    newOrder: number
  ) => Promise<void>;
  /** 특정 컬럼의 태스크들 조회 */
  getTasksByColumn: (columnId: string) => Task[];
  /** 스토어 초기화 */
  reset: () => void;
}

/**
 * Task Store
 * Zustand를 사용한 태스크 전역 상태 관리
 */
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  /**
   * 특정 컬럼의 태스크 목록 조회
   * @param columnId - 컬럼 ID
   * - 로딩 상태 관리
   * - 에러 발생 시 error 상태 업데이트
   */
  fetchTasks: async (columnId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getTasks(columnId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  /**
   * 특정 프로젝트의 모든 태스크 조회
   * @param projectId - 프로젝트 ID
   * - 프로젝트 내 모든 컬럼의 태스크를 한 번에 조회
   */
  fetchTasksByProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getTasksByProject(projectId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  /**
   * 새 태스크 추가
   * @param task - 태스크 입력 데이터
   * - 낙관적 업데이트: 먼저 UI 반영 후 서버 요청
   * - 자동으로 id, createdAt, updatedAt, priority, tags 설정
   * - 성공 시: 서버 응답으로 데이터 교체
   * - 실패 시: 롤백하여 원래 상태로 복구
   */
  addTask: async (task) => {
    const newTask: Task = {
      ...task,
      id: generateId("task"),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: task.priority || "medium",
      tags: task.tags || [],
    };
    // 낙관적 업데이트: 즉시 UI 반영
    set({ tasks: [...get().tasks, newTask] });
    try {
      const savedTask = await taskApi.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        tags: newTask.tags,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        columnId: newTask.columnId,
        order: newTask.order,
      });
      // 성공: 서버 응답으로 교체 (실제 ID 등 반영)
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === newTask.id ? savedTask : t)),
      }));
    } catch (error) {
      // 실패: 롤백
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== newTask.id),
        error: error as Error,
      }));
    }
  },

  /**
   * 태스크 정보 수정
   * @param id - 수정할 태스크 ID
   * @param updates - 수정할 필드들
   * - 낙관적 업데이트 적용
   * - updatedAt 자동 갱신
   * - 실패 시 롤백
   */
  updateTask: async (id, updates) => {
    const prevTasks = get().tasks;
    const hasUpdatedTask = prevTasks.find((task) => task.id === id);
    if (!hasUpdatedTask) return;

    // 낙관적 업데이트
    const updatedTask: Task = {
      ...hasUpdatedTask,
      ...updates,
      updatedAt: new Date(),
    };
    set({
      tasks: prevTasks.map((task) => (task.id === id ? updatedTask : task)),
    });

    try {
      await taskApi.updateTask(id, updates);
    } catch (error) {
      // 실패: 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  /**
   * 태스크 삭제
   * @param id - 삭제할 태스크 ID
   * - 낙관적 업데이트 적용
   * - 실패 시 롤백
   */
  deleteTask: async (id) => {
    const prevTasks = get().tasks;
    const hasDeletedTask = prevTasks.find((task) => task.id === id);
    if (!hasDeletedTask) return;

    // 낙관적 업데이트
    set({ tasks: prevTasks.filter((task) => task.id !== id) });

    try {
      await taskApi.deleteTask(id);
    } catch (error) {
      // 실패: 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  /**
   * 태스크를 다른 컬럼으로 이동
   * @param id - 이동할 태스크 ID
   * @param newColumnId - 목적지 컬럼 ID
   * @param newOrder - 새로운 순서
   * - 드래그 앤 드롭 시 사용
   * - 낙관적 업데이트 적용
   * - 실패 시 롤백
   */
  moveTask: async (id, newColumnId, newOrder) => {
    const prevTasks = get().tasks;
    const movingTask = prevTasks.find((task) => task.id === id);
    if (!movingTask) return;

    // 낙관적 업데이트
    const updatedTask: Task = {
      ...movingTask,
      columnId: newColumnId,
      order: newOrder,
      updatedAt: new Date(),
    };
    set({
      tasks: prevTasks.map((task) => (task.id === id ? updatedTask : task)),
    });

    try {
      await taskApi.updateTask(id, { columnId: newColumnId, order: newOrder });
    } catch (error) {
      // 실패: 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  /**
   * 특정 컬럼의 태스크들 조회
   * @param columnId - 컬럼 ID
   * @returns 해당 컬럼의 태스크 목록 (order 오름차순 정렬)
   */
  getTasksByColumn: (columnId) => {
    return get()
      .tasks.filter((task) => task.columnId === columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  /**
   * 스토어 초기화
   * 모든 상태를 초기값으로 리셋
   */
  reset: () => {
    set({ tasks: [], isLoading: false, error: null });
  },
}));
