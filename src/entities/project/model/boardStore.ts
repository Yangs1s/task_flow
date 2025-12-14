import { create
 } from 'zustand'
import { Board, BoardInput, BoardUpdate } from './types'
import { generateId } from '@/src/shared/lib/generateId'


interface BoardStore {
    boards: Board[]
    addBoard: (board: BoardInput) => void
    updateBoard: (id: string, updates: BoardUpdate) => void
    deleteBoard: (id: string) => void
    getBoard: (id: string) => Board | undefined
    reset: () => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
boards:[],
addBoard: (board) => {
    const newBoard: Board = {
        ...board,
        id: generateId('board'),
        createdAt: new Date(),
        updatedAt: new Date()
    }
    set({ boards: [...get().boards, newBoard] })
},
updateBoard: (id, updates) => set((state) => ({ boards: state.boards.map((board) => board.id === id ? { ...board, ...updates } : board) })),
deleteBoard: (id) => set((state) => ({ boards: state.boards.filter((board) => board.id !== id) })),
getBoard: (id) => get().boards.find((board) => board.id === id),
reset: () => set({ boards: [] }),
}))