const SESSION_KEY = "taskflow-session-id";
/**
 * 현재 사용자의 세션 ID를 가져옵니다.
 * 없으면 새로 생성해서 저장합니다.
 */

export const getSessionId = (): string => {
  // 1. 서버 사이드 렌더링(SSR) 중이면 빈 값 반환 (안전장치)
  if (typeof window === "undefined") return "";

  // 2. 로컬 스토리지에서 ID 찾기
  let sessionId = localStorage.getItem(SESSION_KEY);

  // 3. 없으면 새로 만들어서 저장 (임시 신분증 발급)
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};
