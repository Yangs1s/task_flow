/**
 * Board 엔티티
 * 칸반 보드 전체를 나타냅니다
 */
export interface Project {
  /** 보드 고유 식별자 (DB 저장/조회용) */
  id: string;

  /** 보드 제목 (필수, 화면에 표시) */
  title: string;

  /** 보드 설명 (선택) */
  description?: string;

  /** 생성 시각 */
  createdAt: Date;

  /** 마지막 수정 시각 */
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
}

/**
 * Board 생성 시 입력 타입
 */
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

/**
 * Board 수정 시 입력 타입
 */
export type ProjectUpdate = Partial<
  Omit<Project, "id" | "createdAt" | "updatedAt">
>;
