# TaskFlow 개발 진행 상황 정리

## 📅 작업 일자
2024년 11월 24일

---

## ✅ 완료된 작업

### 1. 프로젝트 초기 설정

#### 테스트 환경 구축
- **Jest + React Testing Library** 설정 완료
- 설치된 패키지:
  ```json
  {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.14",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
  ```

#### 설정 파일
- `jest.config.js` - Jest 설정
- `jest.setup.js` - Testing Library 초기화
- `tsconfig.json` - Jest/Testing Library 타입 지원 추가

#### 테스트 유틸리티
- `src/shared/lib/test-utils.tsx` - 커스텀 render 함수
- `src/types/jest-dom.d.ts` - TypeScript 타입 정의

---

### 2. TDD로 Task Store 개발 (핵심!)

#### 📝 개발 순서 (Red-Green-Refactor)

**🔴 Step 1: 테스트 먼저 작성**
- `src/entities/task/model/__tests__/taskStore.test.ts`
- 총 23개의 테스트 케이스 작성
  - 초기 상태 (1개)
  - 태스크 추가 (6개)
  - 태스크 수정 (6개)
  - 태스크 삭제 (3개)
  - 태스크 이동 (2개)
  - 컬럼별 조회 (2개)
  - Store 초기화 (1개)

**🟢 Step 2: 구현**
- `src/entities/task/model/types.ts` - 타입 정의
  - `Task` 인터페이스
  - `TaskInput` 타입 (생성용)
  - `TaskUpdate` 타입 (수정용)

- `src/entities/task/model/taskStore.ts` - Zustand Store 구현
  - `addTask` - 태스크 추가
  - `updateTask` - 태스크 수정
  - `deleteTask` - 태스크 삭제
  - `moveTask` - 태스크 이동 (드래그 앤 드롭용)
  - `getTasksByColumn` - 컬럼별 조회
  - `reset` - 초기화

**🔵 Step 3: 리팩토링**
- ID 생성 로직 분리: `src/shared/lib/generateId.ts`
- 타입 중복 제거 (types.ts로 통합)
- crypto.randomUUID() → generateId() 변경 (테스트 환경 호환)

---

### 3. Task 엔티티 구조 (FSD 아키텍처)

```
src/entities/task/
├── model/
│   ├── __tests__/
│   │   └── taskStore.test.ts       ✅ 23개 테스트 (모두 통과)
│   ├── types.ts                     ✅ Task 타입 정의
│   └── taskStore.ts                 ✅ Zustand Store 구현
├── api/
│   └── __tests__/
│       └── taskApi.test.ts          ⏳ Placeholder (향후 작업)
└── ui/
    └── __tests__/
        └── TaskCard.test.tsx        ⏳ Placeholder (향후 작업)
```

---

## 📊 Task 타입 정의

```typescript
interface Task {
  id: string              // 고유 식별자
  title: string           // 제목 (필수)
  description?: string    // 설명 (선택)
  columnId: string        // 소속 컬럼 ID
  order?: number          // 컬럼 내 순서 (드래그 앤 드롭)
  priority: 'low' | 'medium' | 'high'  // 우선순위
  tags: string[]          // 태그 목록
  assignee?: string       // 담당자
  createdAt: Date         // 생성 시각
  updatedAt: Date         // 수정 시각
}
```

### 타입이 이렇게 정의된 이유

**요구사항 기반 설계:**
1. ✅ 보드/컬럼/태스크 관리 → `id`, `title`, `columnId`
2. ✅ 드래그 앤 드롭 → `order`, `columnId`
3. ✅ 필터링/검색 → `tags`, `priority`, `assignee`
4. ✅ 상세 모달 → `description`, `createdAt`, `updatedAt`
5. ✅ Supabase 저장 → `id` (고유 키)

---

## 🧪 테스트 전략

### TDD 적용 영역 (완료)
- ✅ **Task Store** (상태 관리 로직)
  - 비즈니스 로직이 중요
  - 버그가 전체 앱에 영향
  - 테스트하기 쉬움

### 일반 개발 예정 (다음 단계)
- ⏳ UI 컴포넌트 (개발 후 테스트)
- ⏳ 드래그 앤 드롭 (통합 테스트)
- ⏳ Supabase API (TDD 적용 예정)

---

## 🛠️ 해결한 기술적 이슈

### 1. TypeScript 타입 에러
**문제:** `toHaveClass` 같은 jest-dom matcher를 TypeScript가 인식 못함

**해결:**
```typescript
// tsconfig.json
"types": ["jest", "@testing-library/jest-dom"]

// src/types/jest-dom.d.ts
import '@testing-library/jest-dom'
```

### 2. Jest 설정 오타
**문제:** `moduleNameMapping` (잘못된 이름)

**해결:** `moduleNameMapper`로 수정

### 3. crypto.randomUUID() 에러
**문제:** Jest의 jsdom 환경에서 crypto.randomUUID() 지원 안 함

**해결:**
```typescript
// src/shared/lib/generateId.ts
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 11)
  return `${prefix}-${timestamp}-${randomPart}`
}
```

---

## 📚 학습한 내용

### 1. TDD (Test-Driven Development)
- ✅ Red-Green-Refactor 사이클 이해
- ✅ 테스트를 먼저 작성하는 이유
- ✅ 요구사항 → 테스트 → 구현 순서

### 2. FSD (Feature-Sliced Design)
- ✅ entities/model/ui/api 구조
- ✅ 각 슬라이스 내부에 `__tests__` 폴더
- ✅ 타입과 로직의 분리 (types.ts vs taskStore.ts)

### 3. Zustand Store 패턴
- ✅ `set`과 `get` 사용법
- ✅ 불변성 유지 (spread operator)
- ✅ 상태 관리 vs 비즈니스 로직 분리

### 4. TypeScript 타입 설계
- ✅ 요구사항 기반 타입 정의
- ✅ Utility Types (`Omit`, `Partial`)
- ✅ JSDoc 주석으로 문서화

---

## 🎯 다음 단계

### Phase 1: 핵심 로직 완성 (TDD)
- [ ] Board Store 구현
- [ ] Column Store 구현
- [ ] 필터링/검색 로직 구현
- [ ] Supabase API 함수 구현

### Phase 2: UI 개발
- [ ] TaskCard 컴포넌트
- [ ] Board/Column 레이아웃
- [ ] 드래그 앤 드롭 (dnd-kit)
- [ ] 상세 모달

### Phase 3: 통합
- [ ] Store와 UI 연결
- [ ] Supabase 실시간 동기화
- [ ] 필터링 UI

---

## 📁 현재 프로젝트 구조

```
taskflow/
├── src/
│   ├── app/                    # FSD App Layer
│   │   ├── store/
│   │   │   └── __tests__/
│   │   └── readme.md
│   ├── entities/               # FSD Entities Layer
│   │   ├── task/              ✅ 완료!
│   │   │   ├── model/
│   │   │   │   ├── __tests__/
│   │   │   │   │   └── taskStore.test.ts  (23 tests ✅)
│   │   │   │   ├── types.ts
│   │   │   │   └── taskStore.ts
│   │   │   ├── api/
│   │   │   └── ui/
│   │   ├── board/             ⏳ 다음 작업
│   │   └── column/            ⏳ 다음 작업
│   ├── features/              # FSD Features Layer
│   ├── shared/                # FSD Shared Layer
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── generateId.ts  ✅ 완료!
│   │   │   ├── test-utils.tsx ✅ 완료!
│   │   │   └── utils.ts
│   │   └── ui/
│   │       ├── __tests__/
│   │       ├── button.tsx
│   │       ├── badge.tsx
│   │       └── ...
│   └── types/
│       └── jest-dom.d.ts      ✅ 완료!
├── jest.config.js             ✅ 완료!
├── jest.setup.js              ✅ 완료!
├── package.json               ✅ 완료!
└── tsconfig.json              ✅ 완료!
```

---

## 💡 핵심 성과

### 1. 완벽한 TDD 사이클 경험
- 테스트 23개 작성 → 구현 → 모두 통과 ✅

### 2. 실전 FSD 아키텍처 적용
- entities/task 구조 완성
- model/api/ui 세그먼트 분리

### 3. TypeScript + Zustand 마스터
- 타입 안정성 100%
- Store 패턴 이해

### 4. 테스트 환경 완벽 구축
- Jest + Testing Library
- jsdom 환경 이슈 해결
- TypeScript 통합

---

## 🎓 배운 교훈

1. **TDD는 요구사항을 명확히 한다**
   - 테스트 = 살아있는 스펙 문서

2. **타입은 요구사항에서 나온다**
   - 5가지 핵심 기능 → Task 타입 도출

3. **작은 단위로 나눠서 개발**
   - Task Store만 먼저 완성 → 다음 Board/Column

4. **테스트 가능한 코드 = 좋은 설계**
   - 순수 함수, 불변성, 의존성 분리

---

## 🚀 다음 작업 시작 가이드

### Board Store를 TDD로 만들기

**1단계: 테스트 작성**
```bash
# 파일 생성
touch src/entities/board/model/__tests__/boardStore.test.ts
```

**2단계: 요구사항 정의**
- Board 생성/수정/삭제
- Board에 Column 추가/제거
- Board 목록 조회

**3단계: 타입 정의**
```typescript
interface Board {
  id: string
  title: string
  columns: string[]  // column IDs
  createdAt: Date
}
```

**4단계: 테스트 작성 → 구현 → 통과!**

---

## 📞 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [FSD 공식 문서](https://feature-sliced.design/)

---

**작성자:** AI Assistant  
**프로젝트:** TaskFlow (칸반 보드 앱)  
**아키텍처:** FSD (Feature-Sliced Design)  
**테스트 전략:** TDD (Test-Driven Development)
