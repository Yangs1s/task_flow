"use client";

import { useColumnStore } from "@/src/entities/column/model/columnStore";
import { TaskColumn } from "@/src/entities/column/ui";
import { AddTaskButton } from "@/src/features/task/ui";
import { AddColumnButton } from "@/src/features/column/ui";
import { TaskController } from "@/src/features/task/ui";
import { useShallow } from "zustand/react/shallow";
import { useProjectStore } from "../entities/project/model/projectStore";
import { useEffect } from "react";

export const KanbanView = ({ projectId }: { projectId: string }) => {
  const allColumns = useColumnStore(
    useShallow((state) => state.columns.sort((a, b) => a.order - b.order))
  );
  useEffect(() => {
    useColumnStore.getState().fetchColumns(projectId);
  }, [projectId]);

  console.log("allColumns :", allColumns);
  // const projectTitle = useProjectStore(
  //   state.projects.find((p) => p.id === BOARD_ID)
  // );
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1></h1>
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
