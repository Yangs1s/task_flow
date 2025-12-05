/**
 * 고유한 ID 생성 함수
 * crypto.randomUUID()를 사용하여 표준 UUID 생성
 * @returns 고유한 문자열 ID
 * @example
 * const id = generateId() // "id-550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId(prefix: string = 'id'): string {
  const uuid = crypto.randomUUID()
  return `${prefix}-${uuid}`
}
