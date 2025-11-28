'use client'

import { useColumnStore } from "@/src/entities/column/model/columnStore"
import { TaskColumn } from "@/src/entities/column/ui"
import {useMemo } from 'react'
interface BoardContainerProps {
  boardId: string
}

export const BoardContainer = ({ boardId }: BoardContainerProps) => {
  const allColumns = useColumnStore((state) => state.columns)

  const columns = useMemo(() => {
    return allColumns.sort((a, b) => a.order - b.order)
  }, [allColumns])
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns?.map((column) => (
        <TaskColumn key={column.id} column={column} />
      ))}
    </div>
  )
}