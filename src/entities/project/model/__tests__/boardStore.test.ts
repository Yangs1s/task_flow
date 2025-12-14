import { renderHook, act } from '@testing-library/react'
import { useBoardStore } from '../boardStore'

describe('BoardStore - 보드 관리', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    useBoardStore.getState().boards = []
  })

  describe('초기 상태', () => {
    it('빈 배열로 시작해야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      expect(result.current.boards).toEqual([])
    })
  })

  describe('보드 추가 (addBoard)', () => {
    it('새 보드를 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({
          title: 'New Board',
          description: 'Board description'
        })
      })
      
      expect(result.current.boards).toHaveLength(1)
      expect(result.current.boards[0].title).toBe('New Board')
      expect(result.current.boards[0].description).toBe('Board description')
    })

    it('보드에 자동으로 id가 부여되어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({
          title: 'Board'
        })
      })
      
      expect(result.current.boards[0].id).toBeDefined()
      expect(typeof result.current.boards[0].id).toBe('string')
      expect(result.current.boards[0].id.length).toBeGreaterThan(0)
    })

    it('보드에 createdAt, updatedAt이 자동으로 설정되어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      const before = new Date()
      
      act(() => {
        result.current.addBoard({
          title: 'Board'
        })
      })
      
      const after = new Date()
      const board = result.current.boards[0]
      
      expect(board.createdAt).toBeInstanceOf(Date)
      expect(board.updatedAt).toBeInstanceOf(Date)
      expect(board.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(board.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('여러 보드를 추가할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board 1' })
        result.current.addBoard({ title: 'Board 2' })
        result.current.addBoard({ title: 'Board 3' })
      })
      
      expect(result.current.boards).toHaveLength(3)
      expect(result.current.boards[0].title).toBe('Board 1')
      expect(result.current.boards[1].title).toBe('Board 2')
      expect(result.current.boards[2].title).toBe('Board 3')
    })
  })

  describe('보드 수정 (updateBoard)', () => {
    it('보드의 제목을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({
          title: 'Original Title'
        })
      })
      
      const boardId = result.current.boards[0].id
      
      act(() => {
        result.current.updateBoard(boardId, {
          title: 'Updated Title'
        })
      })
      
      expect(result.current.boards[0].title).toBe('Updated Title')
    })

    it('보드의 설명을 수정할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({
          title: 'Board',
          description: 'Original'
        })
      })
      
      const boardId = result.current.boards[0].id
      
      act(() => {
        result.current.updateBoard(boardId, {
          description: 'Updated Description'
        })
      })
      
      expect(result.current.boards[0].description).toBe('Updated Description')
    })

    it('수정 시 updatedAt이 갱신되어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({
          title: 'Board'
        })
      })
      
      const boardId = result.current.boards[0].id
      const originalUpdatedAt = result.current.boards[0].updatedAt
      
      setTimeout(() => {
        act(() => {
          result.current.updateBoard(boardId, {
            title: 'Updated'
          })
        })
        
        expect(result.current.boards[0].updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        )
      }, 10)
    })

    it('존재하지 않는 보드 수정 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board' })
      })
      
      act(() => {
        result.current.updateBoard('non-existent-id', {
          title: 'Updated'
        })
      })
      
      expect(result.current.boards[0].title).toBe('Board')
    })
  })

  describe('보드 삭제 (deleteBoard)', () => {
    it('보드를 삭제할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board' })
      })
      
      const boardId = result.current.boards[0].id
      
      act(() => {
        result.current.deleteBoard(boardId)
      })
      
      expect(result.current.boards).toHaveLength(0)
    })

    it('여러 보드 중 특정 보드만 삭제되어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board 1' })
        result.current.addBoard({ title: 'Board 2' })
        result.current.addBoard({ title: 'Board 3' })
      })
      
      const boardIdToDelete = result.current.boards[1].id
      
      act(() => {
        result.current.deleteBoard(boardIdToDelete)
      })
      
      expect(result.current.boards).toHaveLength(2)
      expect(result.current.boards[0].title).toBe('Board 1')
      expect(result.current.boards[1].title).toBe('Board 3')
    })

    it('존재하지 않는 보드 삭제 시 아무 일도 일어나지 않아야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board' })
      })
      
      act(() => {
        result.current.deleteBoard('non-existent-id')
      })
      
      expect(result.current.boards).toHaveLength(1)
    })
  })

  describe('보드 조회 (getBoard)', () => {
    it('ID로 특정 보드를 조회할 수 있어야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board 1' })
        result.current.addBoard({ title: 'Board 2' })
      })
      
      const boardId = result.current.boards[1].id
      const board = result.current.getBoard(boardId)
      
      expect(board).toBeDefined()
      expect(board?.title).toBe('Board 2')
    })

    it('존재하지 않는 ID로 조회 시 undefined를 반환해야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board' })
      })
      
      const board = result.current.getBoard('non-existent-id')
      
      expect(board).toBeUndefined()
    })
  })

  describe('Store 초기화 (reset)', () => {
    it('모든 보드를 삭제해야 함', () => {
      const { result } = renderHook(() => useBoardStore())
      
      act(() => {
        result.current.addBoard({ title: 'Board 1' })
        result.current.addBoard({ title: 'Board 2' })
      })
      
      expect(result.current.boards).toHaveLength(2)
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.boards).toEqual([])
    })
  })
})

