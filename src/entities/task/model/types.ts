/**
 * 우선순위 타입
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Task 엔티티
 * 칸반 보드의 개별 작업 항목을 나타냅니다.
 */
export interface Task {
  // ═══════════════════════════════════════════
  // 📝 사용자 입력 필드 (입력폼에 표시)
  // ═══════════════════════════════════════════
  
  /** 태스크 제목 (필수) */
  title: string
  
  /** 태스크 상세 설명 (선택) */
  description?: string
  
  /** 우선순위 (선택, 기본값: medium) */
  priority: Priority
  
  /** 태그 목록 (선택, 예: ['bug', 'urgent']) */
  tags: string[]
  
  /** 담당자 (선택) */
  assignee?: string
  
  /** 마감일 (선택) */
  dueDate?: Date

  // ═══════════════════════════════════════════
  // 🔧 시스템 자동 생성 필드 (입력폼에 없음)
  // ═══════════════════════════════════════════
  
  /** 태스크 고유 식별자 (자동 생성) */
  id: string
  
  /** 소속된 컬럼 ID (컨텍스트에서 결정) */
  columnId: string
  
  /** 컬럼 내 순서 (드래그 앤 드롭으로 결정) */
  order?: number
  
  /** 생성 시각 (자동) */
  createdAt: Date
  
  /** 수정 시각 (자동) */
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
