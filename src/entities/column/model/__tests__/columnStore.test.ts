import { renderHook, act } from '@testing-library/react'
import { useColumnStore } from '../columnStore'

describe('ColumnStore - 컬럼 관리', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    useColumnStore.getState().reset()
  })

  describe('초기 상태', () => {
    it('빈 배열로 시작해야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      expect(result.current.columns).toEqual([])
    })
  })

  describe('컬럼 추가 (addColumn)', () => {
    it('새 컬럼을 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'To Do',
          boardId: 'board-1'
        })
      })
      
      expect(result.current.columns).toHaveLength(1)
      expect(result.current.columns[0].title).toBe('To Do')
      expect(result.current.columns[0].boardId).toBe('board-1')
    })

    it('컬럼에 자동으로 id가 부여되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'Column',
          boardId: 'board-1'
        })
      })
      
      expect(result.current.columns[0].id).toBeDefined()
      expect(typeof result.current.columns[0].id).toBe('string')
      expect(result.current.columns[0].id.length).toBeGreaterThan(0)
    })

    it('컬럼에 createdAt, updatedAt이 자동으로 설정되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      const before = new Date()
      
      act(() => {
        result.current.addColumn({
          title: 'Column',
          boardId: 'board-1'
        })
      })
      
      const after = new Date()
      const column = result.current.columns[0]
      
      expect(column.createdAt).toBeInstanceOf(Date)
      expect(column.updatedAt).toBeInstanceOf(Date)
      expect(column.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(column.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('order가 없으면 0으로 기본값 설정되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'Column',
          boardId: 'board-1'
        })
      })
      
      expect(result.current.columns[0].order).toBe(0)
    })

    it('여러 컬럼을 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'To Do', boardId: 'board-1' })
        result.current.addColumn({ title: 'In Progress', boardId: 'board-1' })
        result.current.addColumn({ title: 'Done', boardId: 'board-1' })
      })
      
      expect(result.current.columns).toHaveLength(3)
      expect(result.current.columns[0].title).toBe('To Do')
      expect(result.current.columns[1].title).toBe('In Progress')
      expect(result.current.columns[2].title).toBe('Done')
    })
  })

  describe('컬럼 수정 (updateColumn)', () => {
    it('컬럼의 제목을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'Original Title',
          boardId: 'board-1'
        })
      })
      
      const columnId = result.current.columns[0].id
      
      act(() => {
        result.current.updateColumn(columnId, {
          title: 'Updated Title'
        })
      })
      
      expect(result.current.columns[0].title).toBe('Updated Title')
    })

    it('컬럼의 색상을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'Column',
          boardId: 'board-1'
        })
      })
      
      const columnId = result.current.columns[0].id
      
      act(() => {
        result.current.updateColumn(columnId, {
          color: '#ff0000'
        })
      })
      
      expect(result.current.columns[0].color).toBe('#ff0000')
    })

    it('수정 시 updatedAt이 갱신되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({
          title: 'Column',
          boardId: 'board-1'
        })
      })
      
      const columnId = result.current.columns[0].id
      const originalUpdatedAt = result.current.columns[0].updatedAt
      
      setTimeout(() => {
        act(() => {
          result.current.updateColumn(columnId, {
            title: 'Updated'
          })
        })
        
        expect(result.current.columns[0].updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        )
      }, 10)
    })

    it('존재하지 않는 컬럼 수정 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1' })
      })
      
      act(() => {
        result.current.updateColumn('non-existent-id', {
          title: 'Updated'
        })
      })
      
      expect(result.current.columns[0].title).toBe('Column')
    })
  })

  describe('컬럼 삭제 (deleteColumn)', () => {
    it('컬럼을 삭제할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1' })
      })
      
      const columnId = result.current.columns[0].id
      
      act(() => {
        result.current.deleteColumn(columnId)
      })
      
      expect(result.current.columns).toHaveLength(0)
    })

    it('여러 컬럼 중 특정 컬럼만 삭제되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column 1', boardId: 'board-1' })
        result.current.addColumn({ title: 'Column 2', boardId: 'board-1' })
        result.current.addColumn({ title: 'Column 3', boardId: 'board-1' })
      })
      
      const columnIdToDelete = result.current.columns[1].id
      
      act(() => {
        result.current.deleteColumn(columnIdToDelete)
      })
      
      expect(result.current.columns).toHaveLength(2)
      expect(result.current.columns[0].title).toBe('Column 1')
      expect(result.current.columns[1].title).toBe('Column 3')
    })

    it('존재하지 않는 컬럼 삭제 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1' })
      })
      
      act(() => {
        result.current.deleteColumn('non-existent-id')
      })
      
      expect(result.current.columns).toHaveLength(1)
    })
  })

  describe('보드별 컬럼 조회 (getColumnsByBoard)', () => {
    it('특정 보드의 컬럼만 반환해야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column 1', boardId: 'board-1' })
        result.current.addColumn({ title: 'Column 2', boardId: 'board-2' })
        result.current.addColumn({ title: 'Column 3', boardId: 'board-1' })
      })
      
      const board1Columns = result.current.getColumnsByBoard('board-1')
      
      expect(board1Columns).toHaveLength(2)
      expect(board1Columns[0].title).toBe('Column 1')
      expect(board1Columns[1].title).toBe('Column 3')
    })

    it('해당 보드에 컬럼이 없으면 빈 배열을 반환해야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1' })
      })
      
      const emptyColumns = result.current.getColumnsByBoard('board-2')
      
      expect(emptyColumns).toEqual([])
    })

    it('order 순서대로 정렬되어 반환해야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column 2', boardId: 'board-1', order: 2 })
        result.current.addColumn({ title: 'Column 0', boardId: 'board-1', order: 0 })
        result.current.addColumn({ title: 'Column 1', boardId: 'board-1', order: 1 })
      })
      
      const columns = result.current.getColumnsByBoard('board-1')
      
      expect(columns[0].title).toBe('Column 0')
      expect(columns[1].title).toBe('Column 1')
      expect(columns[2].title).toBe('Column 2')
    })
  })

  describe('컬럼 이동 (moveColumn)', () => {
    it('컬럼의 순서를 변경할 수 있어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1', order: 0 })
      })
      
      const columnId = result.current.columns[0].id
      
      act(() => {
        result.current.moveColumn(columnId, 2)
      })
      
      expect(result.current.columns[0].order).toBe(2)
    })

    it('이동 시 updatedAt이 갱신되어야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column', boardId: 'board-1' })
      })
      
      const columnId = result.current.columns[0].id
      const originalUpdatedAt = result.current.columns[0].updatedAt
      
      setTimeout(() => {
        act(() => {
          result.current.moveColumn(columnId, 1)
        })
        
        expect(result.current.columns[0].updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        )
      }, 10)
    })
  })

  describe('Store 초기화 (reset)', () => {
    it('모든 컬럼을 삭제해야 함', () => {
      const { result } = renderHook(() => useColumnStore())
      
      act(() => {
        result.current.addColumn({ title: 'Column 1', boardId: 'board-1' })
        result.current.addColumn({ title: 'Column 2', boardId: 'board-1' })
      })
      
      expect(result.current.columns).toHaveLength(2)
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.columns).toEqual([])
    })
  })
})

