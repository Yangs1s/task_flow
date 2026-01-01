"use client";

import { useTaskStore } from "@/src/entities/task/model/taskStore";
import { DeleteColumnButton } from "@/src/features/column/ui";
import { Column } from "../model/types";
import { TaskCard } from "@/src/entities/task/ui";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
interface TaskColumnProps {
  column: Column;
  footerSlot?: React.ReactNode;
}

export const TaskColumn = ({ column, footerSlot }: TaskColumnProps) => {
  const tasks = useTaskStore(
    useShallow((state) =>
      state.tasks
        .filter((task) => task.columnId === column.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    )
  );
  useEffect(() => {
    useTaskStore.getState().fetchTasks(column.id);
  }, [column.id]);
  return (
    <div className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm gap-4 flex flex-col min-w-80 h-fit">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{column.title}</h1>
        <DeleteColumnButton columnId={column.id} />
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
      {footerSlot && footerSlot}
    </div>
  );
};
