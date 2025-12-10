"use client";
import { AddBoardButton } from "@/src/features/board/add-board";
import { BoardSelectBox } from "@/src/features/board/ui/BoardSelectBox";
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <BoardSelectBox />
          {/* features는 사용자 액션을 담당! */}
          <AddBoardButton />
        </div>
      </div>
    </header>
  );
}
