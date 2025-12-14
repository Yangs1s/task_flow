# 🚀 TaskFlow: 프로젝트 일정 & 칸반 관리 솔루션

## 1. 📋 프로젝트 개요

단순한 할 일 관리(To-Do)를 넘어, **기간(Schedule)**이 존재하는 **프로젝트(Project)** 단위의 업무 관리 도구입니다.
사용자는 프로젝트별로 칸반 보드를 생성하여 업무 흐름을 시각화하고, 드래그 앤 드롭으로 상태를 관리할 수 있습니다.

### 🎯 핵심 목표 (Technical Goals)

- **Data Modeling:** 단순 `Board`가 아닌, `Project(기간, 메타데이터)`와 `View(Kanban)`의 분리 설계.
- **Server State Sync:** `TanStack Query`를 활용한 서버 상태 동기화 및 캐싱 전략.
- **Optimistic UI:** 드래그 앤 드롭 시 서버 응답 대기 없이 즉각 반응하는 **낙관적 업데이트** 구현.
- **FSD Architecture:** 유지보수와 확장을 고려한 **Feature-Sliced Design** 적용.

---

## 2. 🛠 기술 스택 (Tech Stack)

### Core

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + `clsx`/`tailwind-merge`
- **UI Components:** Radix UI (Headless) + Custom Design System

### State Management & Data

- **Server State:** TanStack Query (React Query) v5
- **Client State:** Zustand (UI Global State)
- **Backend & DB:** Supabase (PostgreSQL, Auth, Realtime)
- **Form & Validation:** React Hook Form + Zod

### Interactions

- **Drag & Drop:** `@dnd-kit/core` (접근성 및 모바일 지원 우수)
- **Date Handling:** `date-fns` or `dayjs`

---

## 3. 🗄️ 데이터 모델 설계 (Supabase Schema)

### 1) Projects (프로젝트)

> 프로젝트의 메타데이터를 관리하는 최상위 엔티티

- `id`: UUID (PK)
- `title`: Text
- `description`: Text
- `start_date`: Date (ISO 8601)
- `end_date`: Date (ISO 8601)
- `status`: Enum ('active', 'completed', 'archived')
- `owner_id`: UUID (FK - Auth User)

### 2) Columns (칸반 컬럼)

> 프로젝트 내 업무 상태를 구분하는 컨테이너

- `id`: UUID (PK)
- `project_id`: UUID (FK)
- `title`: Text (ex: To Do, In Progress)
- `order_index`: Float (Lexorank or Fractional Indexing 권장)

### 3) Tasks (업무)

> 실제 수행할 작업 단위

- `id`: UUID (PK)
- `column_id`: UUID (FK)
- `project_id`: UUID (FK - 조회 최적화용 역정규화)
- `title`: Text
- `content`: Text (Markdown)
- `due_date`: Date
- `priority`: Enum ('low', 'medium', 'high')
- `order_index`: Float
- `assignee_id`: UUID (FK - User)

---

## 4. 🏗️ FSD 폴더 구조 (Feature-Sliced Design)

```text
src/
├── app/                  # Next.js App Router
│   ├── (dashboard)/      # Layout: Sidebar, Header 포함
│   │   ├── projects/     # [Page] 내 프로젝트 목록
│   │   └── project/[id]/ # [Page] 특정 프로젝트의 칸반 보드
│   └── providers/        # QueryClient, AuthProvider 등
│
├── widgets/              # 페이지를 구성하는 독립적인 UI 블록
│   ├── project-list/     # 프로젝트 카드 그리드 + 생성 버튼
│   ├── kanban-board/     # 컬럼 + 태스크 + DnD 컨텍스트 통합
│   └── task-detail/      # 태스크 상세/수정 모달
│
├── features/             # 비즈니스 로직 단위
│   ├── project/          # [Create, Filter] 프로젝트 생성 및 필터링
│   ├── task/             # [CRUD] 태스크 생성, 수정, 삭제 로직
│   └── column/           # [Manage] 컬럼 추가, 순서 변경
│
├── entities/             # 비즈니스 데이터 모델 & UI 조각
│   ├── project/          # Project Type, ProjectCard
│   ├── task/             # Task Type, TaskCard
│   ├── column/           # Column Type
│   └── user/             # User Type
│
└── shared/               # 공통 재사용 모듈
    ├── ui/               # Button, Input, Modal, Dropdown (Radix 기반)
    ├── api/              # Supabase Client Factory
    └── lib/              # Utils (Date format, Validation)
```
