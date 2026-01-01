"use client";

import { useColumnStore } from "@/src/entities/column/model/columnStore";
import { TaskColumn } from "@/src/entities/column/ui";
import { AddTaskButton } from "@/src/features/task/ui";
import { AddColumnButton } from "@/src/features/column/ui";
import { TaskController } from "@/src/features/task/ui";
import { useShallow } from "zustand/react/shallow";
import { useProjectStore } from "../entities/project/model/projectStore";
import { useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 포맷팅 헬퍼 함수
 * @param date - 포맷팅할 날짜
 * @returns 포맷된 날짜 문자열 (예: 2024년 1월 15일)
 */
const formatDate = (date: Date | undefined) => {
  if (!date) return "-";
  return format(new Date(date), "yyyy년 M월 d일", { locale: ko });
};

export const KanbanView = ({ projectId }: { projectId: string }) => {
  const allColumns = useColumnStore(
    useShallow((state) => state.columns.sort((a, b) => a.order - b.order))
  );
  const project = useProjectStore(
    useShallow((state) => state.getProject(projectId))
  );

  console.log("project :", project);
  useEffect(() => {
    useColumnStore.getState().fetchColumns(projectId);
  }, [projectId]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 프로젝트 헤더 정보 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          {project?.title || "프로젝트 선택"}
        </h1>
        {project && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              📅 시작: {formatDate(project.startDate)}
            </span>
            <span className="flex items-center gap-1">
              🏁 종료: {formatDate(project.endDate)}
            </span>
            {project.description && (
              <span className="text-gray-400">| {project.description}</span>
            )}
          </div>
        )}
      </div>
      <TaskController />
      <div className="flex gap-4 overflow-x-auto">
        {allColumns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            footerSlot={<AddTaskButton columnId={column.id} />}
          />
        ))}
        <AddColumnButton />
      </div>
    </div>
  );
};
