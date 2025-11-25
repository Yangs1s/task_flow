'use client'
import { AddBoardButton } from "@/src/features/board/add-board";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          
          {/* features는 사용자 액션을 담당! */}
          <AddBoardButton />
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <input
            type="text"
            placeholder="태스크 검색..."
            className="p-2 border rounded bg-white border-gray-300"
          />

          {/* Priority Filter */}
          <select className="p-2 border rounded bg-white border-gray-300">
            <option value="all">모든 우선순위</option>
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
        </div>
      </div>
    </header>
  );
}

