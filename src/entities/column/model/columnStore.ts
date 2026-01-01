import { Column, ColumnInput, ColumnUpdate } from "./types";
import { create } from "zustand";
import { generateId } from "@/src/shared/lib/generateId";
import { columnApi } from "../api/columnApi";

interface ColumnStore {
  columns: Column[];
  isLoading: boolean;
  error: Error | null;
  fetchColumns: (projectId: string) => Promise<void>;
  addColumn: (column: ColumnInput) => Promise<void>;
  updateColumn: (id: string, updates: ColumnUpdate) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  moveColumn: (id: string, newOrder: number) => void;
  getColumnsByBoard: (boardId: string) => Column[];
  reset: () => void;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,
  fetchColumns: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const columns = await columnApi.getColumns(projectId);
      set({ columns, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  addColumn: async (column) => {
    const newColumn: Column = {
      ...column,
      id: generateId("column"),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: column.order || get().columns.length,
    };
    // 낙관적 업데이트
    set({ columns: [...get().columns, newColumn] });
    try {
      const savedColumn = await columnApi.createColumn({
        title: column.title,
        boardId: column.boardId,
        order: newColumn.order,
        color: column.color,
        taskLimit: column.taskLimit,
      });
      // 서버 응답으로 교체
      set((state) => ({
        columns: state.columns.map((c) =>
          c.id === newColumn.id ? savedColumn : c
        ),
      }));
    } catch (error) {
      // 실패 시 롤백
      set((state) => ({
        columns: state.columns.filter((c) => c.id !== newColumn.id),
        error: error as Error,
      }));
    }
  },
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
      // 실패 시 롤백
      set({ columns: prevColumns, error: error as Error });
    }
  },
  deleteColumn: async (id) => {
    const prevColumns = get().columns;
    // 낙관적 업데이트
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
    }));
    try {
      await columnApi.deleteColumn(id);
    } catch (error) {
      // 실패 시 롤백
      set({ columns: prevColumns, error: error as Error });
    }
  },
  moveColumn: (id, newOrder) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === id ? { ...column, order: newOrder } : column
      ),
    })),
  getColumnsByBoard: (boardId) =>
    get()
      .columns.filter((column) => column.boardId === boardId)
      .sort((a, b) => a.order - b.order),
  reset: () => set({ columns: [], isLoading: false, error: null }),
}));
