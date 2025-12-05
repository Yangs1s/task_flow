'use client'

import { AddTaskButton } from "@/src/features/task/ui"
import { DeleteColumnButton } from "@/src/features/column/ui"
import { useTaskStore } from "@/src/entities/task/model/taskStore"
import { TaskCard } from "@/src/entities/task/ui"
import { Column } from "../model/types"
import { useMemo } from "react"

interface TaskColumnProps {
  column: Column
}

export const TaskColumn = ({ column }: TaskColumnProps) => {
  const allTasks = useTaskStore((state) => state.tasks)
  
  const tasks = useMemo(() => {
    return allTasks
      .filter((task) => task.columnId === column.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [allTasks, column.id])

  return (
    <div className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm gap-4 flex flex-col min-w-80 h-fit">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{column.title}</h1>
        <DeleteColumnButton />
      </div>
      
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
      
      <AddTaskButton columnId={column.id} />
    </div>
  )
}