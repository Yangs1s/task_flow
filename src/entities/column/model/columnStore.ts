import { Column, ColumnInput, ColumnUpdate } from "./types";
import { create } from "zustand";
import { generateId } from "@/src/shared/lib/generateId";
import { columnApi } from "../api/columnApi";

/**
 * Column Store 인터페이스
 * 칸반 컬럼 상태 관리를 위한 Zustand store 타입 정의
 */
interface ColumnStore {
  /** 컬럼 목록 */
  columns: Column[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
  /** 서버에서 컬럼 목록 조회 */
  fetchColumns: (projectId: string) => Promise<void>;
  /** 새 컬럼 추가 */
  addColumn: (column: ColumnInput) => Promise<void>;
  /** 컬럼 정보 수정 */
  updateColumn: (id: string, updates: ColumnUpdate) => Promise<void>;
  /** 컬럼 삭제 */
  deleteColumn: (id: string) => Promise<void>;
  /** 컬럼 순서 변경 (로컬 전용) */
  moveColumn: (id: string, newOrder: number) => void;
  /** 특정 보드의 컬럼들 조회 */
  getColumnsByBoard: (boardId: string) => Column[];
  /** 스토어 초기화 */
  reset: () => void;
}

/**
 * Column Store
 * Zustand를 사용한 칸반 컬럼 전역 상태 관리
 */
export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,

  /**
   * 서버에서 컬럼 목록 조회
   * @param projectId - 프로젝트 ID
   * - 로딩 상태 관리
   * - 에러 발생 시 error 상태 업데이트
   */
  fetchColumns: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const columns = await columnApi.getColumns(projectId);
      set({ columns, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  /**
   * 새 컬럼 추가
   * @param column - 컬럼 입력 데이터
   * - 낙관적 업데이트: 먼저 UI 반영 후 서버 요청
   * - 성공 시: 서버 응답으로 데이터 교체
   * - 실패 시: 롤백하여 원래 상태로 복구
   */
  addColumn: async (column) => {
    const newColumn: Column = {
      ...column,
      id: generateId("column"),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: column.order || get().columns.length,
    };
    // 낙관적 업데이트: 즉시 UI 반영
    set({ columns: [...get().columns, newColumn] });
    try {
      const savedColumn = await columnApi.createColumn({
        title: column.title,
        boardId: column.boardId,
        order: newColumn.order,
        color: column.color,
        taskLimit: column.taskLimit,
      });
      // 성공: 서버 응답으로 교체 (실제 ID 등 반영)
      set((state) => ({
        columns: state.columns.map((c) =>
          c.id === newColumn.id ? savedColumn : c
        ),
      }));
    } catch (error) {
      // 실패: 롤백
      set((state) => ({
        columns: state.columns.filter((c) => c.id !== newColumn.id),
        error: error as Error,
      }));
    }
  },

  /**
   * 컬럼 정보 수정
   * @param id - 수정할 컬럼 ID
   * @param updates - 수정할 필드들
   * - 낙관적 업데이트 적용
   * - 실패 시 롤백
   */
  updateColumn: async (id, updates) => {
    const prevColumns = get().columns;
    // 낙관적 업데이트
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === id ? { ...column, ...updates } : column
      ),
    }));
    try {
      await columnApi.updateColumn(id, updates);
    } catch (error) {
      // 실패: 롤백
      set({ columns: prevColumns, error: error as Error });
    }
  },

  /**
   * 컬럼 삭제
   * @param id - 삭제할 컬럼 ID
   * - 낙관적 업데이트 적용
   * - 실패 시 롤백
   */
  deleteColumn: async (id) => {
    const prevColumns = get().columns;
    // 낙관적 업데이트
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
    }));
    try {
      await columnApi.deleteColumn(id);
    } catch (error) {
      // 실패: 롤백
      set({ columns: prevColumns, error: error as Error });
    }
  },

  /**
   * 컬럼 순서 변경 (로컬 전용)
   * @param id - 이동할 컬럼 ID
   * @param newOrder - 새로운 순서
   * - 드래그 앤 드롭 시 사용
   * - 서버 동기화는 별도 처리 필요
   */
  moveColumn: (id, newOrder) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === id ? { ...column, order: newOrder } : column
      ),
    })),

  /**
   * 특정 보드의 컬럼들 조회
   * @param boardId - 보드 ID
   * @returns 해당 보드의 컬럼 목록 (order 오름차순 정렬)
   */
  getColumnsByBoard: (boardId) =>
    get()
      .columns.filter((column) => column.boardId === boardId)
      .sort((a, b) => a.order - b.order),

  /**
   * 스토어 초기화
   * 모든 상태를 초기값으로 리셋
   */
  reset: () => set({ columns: [], isLoading: false, error: null }),
}));
