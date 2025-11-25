import { create } from 'zustand'
import { Task, TaskInput, TaskUpdate } from './types'
import { generateId } from '@/src/shared/lib/generateId'

/**
 * Task Store 인터페이스
 * 태스크 상태 관리를 위한 Zustand store
 * 로직은 상태관리 로직만 만들기 때문에 비즈니스 로직은 여기서 작성하지 않습니다.
 */
interface TaskStore {
  /** 모든 태스크 목록 */
  tasks: Task[]
  
  /**
   * 새 태스크 추가
   * @param task - 태스크 정보 (id, createdAt, updatedAt은 자동 생성)
   * @example
   * addTask({ 
   *   title: '버그 수정', 
   *   columnId: 'todo',
   *   priority: 'high',
   *   tags: ['bug']
   * })
   */
  addTask: (task: TaskInput) => void
  
  /**
   * 태스크 정보 수정
   * @param id - 수정할 태스크 ID
   * @param updates - 수정할 필드들 (부분 업데이트)
   * @example
   * updateTask('task-123', { title: '새 제목', priority: 'high' })
   */
  updateTask: (id: string, updates: TaskUpdate) => void
  
  /**
   * 태스크 삭제
   * @param id - 삭제할 태스크 ID
   */
  deleteTask: (id: string) => void
  
  /**
   * 태스크를 다른 컬럼으로 이동 (드래그 앤 드롭용)
   * @param id - 이동할 태스크 ID
   * @param newColumnId - 목적지 컬럼 ID
   * @param newOrder - 목적지 컬럼 내 순서
   * @example
   * moveTask('task-123', 'in-progress', 0)
   */
  moveTask: (id: string, newColumnId: string, newOrder: number) => void
  
  /**
   * 특정 컬럼의 태스크들만 조회
   * @param columnId - 컬럼 ID
   * @returns 해당 컬럼의 태스크 목록
   * @example
   * const todoTasks = getTasksByColumn('todo')
   */
  getTasksByColumn: (columnId: string) => Task[]
  
  /**
   * 스토어 초기화 (테스트용)
   */
  reset: () => void
}

// TODO: 여기서부터 구현하세요!
// 힌트:
// 1. create<TaskStore>()로 store 생성
// 2. addTask에서 id 자동 생성 (Date.now() 또는 nanoid 사용)
// 3. addTask에서 createdAt, updatedAt을 new Date()로 설정
// 4. priority 기본값: 'medium', tags 기본값: []
// 5. updateTask에서 updatedAt 갱신
// 6. moveTask에서 columnId와 order 업데이트
// 7. getTasksByColumn은 filter 사용

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: generateId('task'),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: task.priority || 'medium',
      tags: task.tags || []
    }
    set({ tasks: [...get().tasks, newTask] })
  },
  
  updateTask: (id, updates) => {
    // TODO: 구현하세요
    const hasUpdatedTask = get().tasks.find((task) => task.id === id)
    
    // 수정할 테스크가 없다면 그냥 return
    if (!hasUpdatedTask) return
    // 수정될 테스트
    const updatedTask: Task = {
      ...hasUpdatedTask,
      ...updates,
      updatedAt: new Date()
    }
    set({ tasks: get().tasks.map((task) => task.id === id ? updatedTask : task) })

  },
  
  deleteTask: (id) => {
    // TODO: 구현하세요
    const hasDeletedTask = get().tasks.find((task) => task.id === id)
    if (!hasDeletedTask) return
    set({ tasks: get().tasks.filter((task) => task.id !== id) })
  },
  
  moveTask: (id, newColumnId, newOrder) => {
    // TODO: 구현하세요
    const movingTask = get().tasks.find((task) => task.id === id)  
    if (!movingTask) return
    const updatedTask: Task = {
      ...movingTask,
      columnId: newColumnId,
      order: newOrder,
      updatedAt: new Date()
    }
    set({ tasks: get().tasks.map((task) => task.id === id ? updatedTask : task) })
  },
  
  getTasksByColumn: (columnId) => {
    // TODO: 구현하세요
    return get().tasks.filter((task) => task.columnId === columnId)
  },
  
  reset: () => {
    // TODO: 구현하세요
    set({ tasks: [] })
  }
}))
