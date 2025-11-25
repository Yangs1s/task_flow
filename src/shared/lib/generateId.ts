/**
 * 고유한 ID 생성 함수
 * crypto.randomUUID()의 대체재 (테스트 환경 호환)
 * @returns 고유한 문자열 ID
 * @example
 * const id = generateId() // "task-1234567890-abc123def"
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 11)
  return `${prefix}-${timestamp}-${randomPart}`
}
