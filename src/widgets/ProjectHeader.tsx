"use client";
import { AddBoardButton } from "@/src/features/project/add-board";
import { ProjectSelectBox } from "@/src/features/project/ui";

export const ProjectHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <ProjectSelectBox />
          {/* features는 사용자 액션을 담당! */}
          <AddBoardButton />
        </div>
      </div>
    </header>
  );
};
