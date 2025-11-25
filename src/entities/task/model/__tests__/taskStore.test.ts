import { renderHook, act } from '@testing-library/react'
import { useTaskStore } from '../taskStore'

describe('TaskStore - 태스크 관리', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    useTaskStore.getState().reset()
  })

  describe('초기 상태', () => {
    it('빈 배열로 시작해야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      expect(result.current.tasks).toEqual([])
    })
  })

  describe('태스크 추가 (addTask)', () => {
    it('새 태스크를 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'New Task',
          description: 'Task description',
          columnId: 'col-1'
        })
      })
      
      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('New Task')
      expect(result.current.tasks[0].description).toBe('Task description')
      expect(result.current.tasks[0].columnId).toBe('col-1')
    })

    it('태스크에 자동으로 id가 부여되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      expect(result.current.tasks[0].id).toBeDefined()
      expect(typeof result.current.tasks[0].id).toBe('string')
      expect(result.current.tasks[0].id.length).toBeGreaterThan(0)
    })

    it('태스크에 createdAt, updatedAt이 자동으로 설정되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      const before = new Date()
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      const after = new Date()
      const task = result.current.tasks[0]
      
      expect(task.createdAt).toBeInstanceOf(Date)
      expect(task.updatedAt).toBeInstanceOf(Date)
      expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('priority가 없으면 medium으로 기본값 설정되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      expect(result.current.tasks[0].priority).toBe('medium')
    })

    it('tags가 없으면 빈 배열로 기본값 설정되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      expect(result.current.tasks[0].tags).toEqual([])
    })

    it('여러 태스크를 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task 1', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 2', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 3', columnId: 'col-2' })
      })
      
      expect(result.current.tasks).toHaveLength(3)
      expect(result.current.tasks[0].title).toBe('Task 1')
      expect(result.current.tasks[1].title).toBe('Task 2')
      expect(result.current.tasks[2].title).toBe('Task 3')
    })
  })

  describe('태스크 수정 (updateTask)', () => {
    it('태스크의 제목을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Original Title',
          columnId: 'col-1'
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.updateTask(taskId, {
          title: 'Updated Title'
        })
      })
      
      expect(result.current.tasks[0].title).toBe('Updated Title')
    })

    it('태스크의 설명을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          description: 'Original',
          columnId: 'col-1'
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.updateTask(taskId, {
          description: 'Updated Description'
        })
      })
      
      expect(result.current.tasks[0].description).toBe('Updated Description')
    })

    it('태스크의 우선순위를 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1',
          priority: 'low'
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.updateTask(taskId, {
          priority: 'high'
        })
      })
      
      expect(result.current.tasks[0].priority).toBe('high')
    })

    it('수정 시 updatedAt이 갱신되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      const taskId = result.current.tasks[0].id
      const originalUpdatedAt = result.current.tasks[0].updatedAt
      
      // 시간이 지났음을 보장하기 위해 약간 대기
      setTimeout(() => {
        act(() => {
          result.current.updateTask(taskId, {
            title: 'Updated'
          })
        })
        
        expect(result.current.tasks[0].updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        )
      }, 10)
    })

    it('존재하지 않는 태스크 수정 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task', columnId: 'col-1' })
      })
      
      act(() => {
        result.current.updateTask('non-existent-id', {
          title: 'Updated'
        })
      })
      
      expect(result.current.tasks[0].title).toBe('Task')
    })

    it('여러 필드를 동시에 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1',
          priority: 'low'
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.updateTask(taskId, {
          title: 'Updated Task',
          priority: 'high',
          tags: ['urgent', 'bug']
        })
      })
      
      expect(result.current.tasks[0].title).toBe('Updated Task')
      expect(result.current.tasks[0].priority).toBe('high')
      expect(result.current.tasks[0].tags).toEqual(['urgent', 'bug'])
    })
  })

  describe('태스크 삭제 (deleteTask)', () => {
    it('태스크를 삭제할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task', columnId: 'col-1' })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.deleteTask(taskId)
      })
      
      expect(result.current.tasks).toHaveLength(0)
    })

    it('여러 태스크 중 특정 태스크만 삭제되어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task 1', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 2', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 3', columnId: 'col-1' })
      })
      
      const taskIdToDelete = result.current.tasks[1].id
      
      act(() => {
        result.current.deleteTask(taskIdToDelete)
      })
      
      expect(result.current.tasks).toHaveLength(2)
      expect(result.current.tasks[0].title).toBe('Task 1')
      expect(result.current.tasks[1].title).toBe('Task 3')
    })

    it('존재하지 않는 태스크 삭제 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task', columnId: 'col-1' })
      })
      
      act(() => {
        result.current.deleteTask('non-existent-id')
      })
      
      expect(result.current.tasks).toHaveLength(1)
    })
  })

  describe('태스크 이동 (moveTask)', () => {
    it('태스크를 다른 컬럼으로 이동할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({
          title: 'Task',
          columnId: 'col-1'
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.moveTask(taskId, 'col-2', 0)
      })
      
      expect(result.current.tasks[0].columnId).toBe('col-2')
      expect(result.current.tasks[0].order).toBe(0)
    })

    it('태스크의 순서(order)를 변경할 수 있어야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task 1', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 2', columnId: 'col-1' })
      })
      
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.moveTask(taskId, 'col-1', 1)
      })
      
      expect(result.current.tasks[0].order).toBe(1)
    })
  })

  describe('컬럼별 태스크 조회 (getTasksByColumn)', () => {
    it('특정 컬럼의 태스크만 반환해야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task 1', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 2', columnId: 'col-2' })
        result.current.addTask({ title: 'Task 3', columnId: 'col-1' })
      })
      
      const col1Tasks = result.current.getTasksByColumn('col-1')
      
      expect(col1Tasks).toHaveLength(2)
      expect(col1Tasks[0].title).toBe('Task 1')
      expect(col1Tasks[1].title).toBe('Task 3')
    })

    it('해당 컬럼에 태스크가 없으면 빈 배열을 반환해야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task', columnId: 'col-1' })
      })
      
      const emptyTasks = result.current.getTasksByColumn('col-2')
      
      expect(emptyTasks).toEqual([])
    })
  })

  describe('Store 초기화 (reset)', () => {
    it('모든 태스크를 삭제해야 함', () => {
      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        result.current.addTask({ title: 'Task 1', columnId: 'col-1' })
        result.current.addTask({ title: 'Task 2', columnId: 'col-1' })
      })
      
      expect(result.current.tasks).toHaveLength(2)
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.tasks).toEqual([])
    })
  })
})
