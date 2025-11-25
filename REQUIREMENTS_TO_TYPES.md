# 요구사항 → 타입 정의 과정

## 1. 요구사항 분석

### 기능 1: 보드/컬럼/태스크 관리
- **태스크 제목** 필요 → `title: string`
- **태스크 설명** 필요 → `description?: string`
- **어느 컬럼에 속하는지** 필요 → `columnId: string`

### 기능 2: 드래그 앤 드롭
- **태스크 순서** 필요 → `order?: number`
- **어느 컬럼에 있는지** (이미 있음) → `columnId: string`

### 기능 3: 필터링/검색
- **태그로 필터링** → `tags: string[]`
- **우선순위로 필터링** → `priority: 'low' | 'medium' | 'high'`
- **담당자로 필터링** → `assignee?: string`

### 기능 4: 상세 모달
- **생성일** 표시 → `createdAt: Date`
- **수정일** 표시 → `updatedAt: Date`
- **댓글** → 나중에 별도 entity로 (Comment 타입)

### 기능 5: Supabase 저장
- **고유 ID** 필요 → `id: string`

---

## 2. 결과 타입 정의

```typescript
export interface Task {
  // 기본 정보 (기능 1)
  id: string              // 고유 식별자 (기능 5)
  title: string           // 제목 (필수)
  description?: string    // 설명 (선택)
  columnId: string        // 어느 컬럼에 속하는지 (기능 1, 2)
  
  // 드래그 앤 드롭 (기능 2)
  order?: number          // 컬럼 내 순서
  
  // 필터링/검색 (기능 3)
  priority: 'low' | 'medium' | 'high'  // 우선순위
  tags: string[]                        // 태그들
  assignee?: string                     // 담당자
  
  // 메타 정보 (기능 4)
  createdAt: Date         // 생성 시간
  updatedAt: Date         // 수정 시간
}
```

---

## 3. TDD에서 타입을 정의하는 과정

### Step 1: 최소 요구사항으로 시작
```typescript
// 처음에는 이것만
interface Task {
  id: string
  title: string
}
```

### Step 2: 테스트 작성하면서 필요한 것 추가
```typescript
// "태스크를 컬럼에 추가한다" 테스트 작성
it('should add task to column', () => {
  addTask({ title: 'Task', columnId: 'col-1' })  // ← columnId 필요!
})

// → Task에 columnId 추가
interface Task {
  id: string
  title: string
  columnId: string  // 추가!
}
```

### Step 3: 점진적으로 확장
```typescript
// "우선순위로 필터링" 테스트 작성
it('should filter by priority', () => {
  const high = tasks.filter(t => t.priority === 'high')  // ← priority 필요!
})

// → Task에 priority 추가
interface Task {
  id: string
  title: string
  columnId: string
  priority: 'low' | 'medium' | 'high'  // 추가!
}
```

---

## 4. 실전 조언

### ✅ 완벽한 타입을 처음부터 만들 필요 없음
- 최소한으로 시작
- 필요할 때마다 추가
- 테스트가 필요성을 알려줌

### ✅ 다른 프로젝트 참고
- Trello 같은 칸반 앱들 보면서 "어떤 데이터가 필요한지" 파악
- GitHub Issues, Jira 등 참고

### ✅ 프로토타입 먼저 그려보기
```
[ TODO ]     [ IN PROGRESS ]     [ DONE ]
┌─────────┐  ┌─────────────┐    ┌──────┐
│ Task 1  │  │ Task 2      │    │Task 3│
│ 🔴 High │  │ 🟡 Medium   │    │      │
│ @user1  │  │ #bug #urgent│    │      │
└─────────┘  └─────────────┘    └──────┘
```
이 UI에서 필요한 데이터가 보임!

---

## 5. 지금 우리가 만든 타입이 적절한 이유

```typescript
interface Task {
  id: string              // ✅ DB 저장/조회
  title: string           // ✅ 화면에 표시
  description?: string    // ✅ 상세 모달에서 표시
  columnId: string        // ✅ 어느 컬럼에 속하는지
  order?: number          // ✅ 드래그 앤 드롭 순서
  priority: 'low' | 'medium' | 'high'  // ✅ 필터링, UI 색상
  tags: string[]          // ✅ 필터링, 검색
  assignee?: string       // ✅ 담당자 필터링
  createdAt: Date         // ✅ 정렬, 표시
  updatedAt: Date         // ✅ 변경 추적
}
```

당신의 5가지 핵심 기능을 **모두 지원**합니다!

