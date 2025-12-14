"use client";

import { useColumnStore } from "@/src/entities/column/model/columnStore";
import { TaskColumn } from "@/src/entities/column/ui";
import { useMemo, useEffect } from "react";
import { AddTaskButton } from "@/src/features/task/ui";
import { AddColumnButton } from "@/src/features/column/ui";
import { TaskController } from "@/src/features/task/ui";

interface BoardContainerProps {
  boardId: string;
}

export const KanbanView = ({ boardId }: BoardContainerProps) => {
  const allColumns = useColumnStore((state) => state.columns);
  const addColumn = useColumnStore((state) => state.addColumn);

  // 초기 컬럼 데이터 세팅 (컬럼이 없을 때만)
  useEffect(() => {
    if (allColumns.length === 0) {
      addColumn({ title: "📋 To Do", boardId, order: 0 });
      addColumn({ title: "🚧 In Progress", boardId, order: 1 });
      addColumn({ title: "✅ Done", boardId, order: 2 });
    }
  }, [allColumns.length, addColumn, boardId]);

  const columns = useMemo(() => {
    return [...allColumns].sort((a, b) => a.order - b.order);
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <TaskController />
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
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
