/**
 * 우선순위 타입
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Task 엔티티
 * 칸반 보드의 개별 작업 항목을 나타냅니다.
 */
export interface Task {
  /** 태스크 고유 식별자 (DB 저장/조회용) */
  id: string
  
  /** 태스크 제목 (필수, 화면에 표시) */
  title: string
  
  /** 태스크 상세 설명 (선택, 모달에서 표시) */
  description?: string
  
  /** 소속된 컬럼 ID (어느 상태에 있는지: TODO, IN_PROGRESS, DONE 등) */
  columnId: string
  
  /** 컬럼 내에서의 순서 (드래그 앤 드롭 시 사용) */
  order?: number
  
  /** 우선순위 (필터링/정렬/UI 색상 표시용) */
  priority:Priority
  
  /** 태그 목록 (검색/필터링용, 예: ['bug', 'urgent']) */
  tags: string[]
  
  /** 담당자 ID 또는 이름 (필터링용) */
  assignee?: string
  
  /** 마감일 (종료일, 정렬/필터링/표시용) */
  dueDate?: Date
  
  /** 생성 시각 (정렬/표시용) */
  createdAt: Date
  
  /** 마지막 수정 시각 (변경 추적용) */
  updatedAt: Date
}

/**
 * Task 생성 시 입력 타입
 * id, createdAt, updatedAt은 자동 생성되므로 제외
 * priority, tags는 기본값이 있으므로 선택 사항
 */
export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'priority' | 'tags'> & {
  priority?: Task['priority']
  tags?: string[]
}

/**
 * Task 수정 시 입력 타입
 * id, createdAt, updatedAt은 수정 불가
 * 나머지는 모두 선택적으로 수정 가능
 */
export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
