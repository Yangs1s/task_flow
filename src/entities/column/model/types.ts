/**
 * Column 엔티티
 * 칸반 보드의 상태 컬럼을 나타냅니다 (예: TODO, IN_PROGRESS, DONE)
 */
export interface Column {
  /** 컬럼 고유 식별자 (DB 저장/조회용) */
  id: string

  /** 컬럼 제목 (필수, 화면에 표시) */
  title: string

  /** 소속된 보드 ID */
  boardId: string

  /** 보드 내에서의 순서 (드래그 앤 드롭 시 사용) */
  order: number

  /** 컬럼의 색상 테마 (선택, UI 구분용) */
  color?: string

  /** 이 컬럼에 포함할 수 있는 최대 태스크 수 (선택, WIP 제한) */
  taskLimit?: number

  /** 생성 시각 */
  createdAt: Date

  /** 마지막 수정 시각 */
  updatedAt: Date
}

/**
 * Column 생성 시 입력 타입
 */
export type ColumnInput = Omit<Column, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
  order?: number
}

/**
 * Column 수정 시 입력 타입
 */
export type ColumnUpdate = Partial<Omit<Column, 'id' | 'createdAt' | 'updatedAt'>>

