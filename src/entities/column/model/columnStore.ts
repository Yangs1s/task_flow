import { Column, ColumnInput, ColumnUpdate } from "./types"
import { create } from "zustand"
import { generateId } from "@/src/shared/lib/generateId"

interface ColumnStore {
    columns: Column[]
    addColumn: (column: ColumnInput) => void
    updateColumn: (id: string, updates: ColumnUpdate) => void
    deleteColumn: (id: string) => void
    moveColumn: (id: string, newOrder: number) => void
    getColumnsByBoard: (boardId: string) => Column[]
    reset: () => void
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
    columns: [],
    addColumn: (column) => {
        const newColumn: Column = {
            ...column,
            id: generateId('column'),
            createdAt: new Date(),
            updatedAt: new Date(),
            order : column.order || 0
        }
        set({ columns: [...get().columns, newColumn] })
    },
    updateColumn: (id, updates) => set((state) => ({ columns: state.columns.map((column) => column.id === id ? { ...column, ...updates } : column) })),
    deleteColumn: (id) => set((state) => ({ columns: state.columns.filter((column) => column.id !== id) })),
    moveColumn: (id, newOrder) => set((state) => ({ columns: state.columns.map((column) => column.id === id ? { ...column, order: newOrder } : column) })),
    getColumnsByBoard: (boardId) => get().columns.filter((column) => column.boardId === boardId).sort((a, b) => a.order - b.order),
    reset: () => set({ columns: [] }),
}))