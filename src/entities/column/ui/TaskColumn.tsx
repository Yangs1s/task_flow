import { AddTaskButton } from "@/src/features/task/ui"
import { DeleteColumnButton } from "@/src/features/column/ui"
export const TaskColumn = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm gap-4 flex flex-col h-full">
      <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">할 일</h1>
        <DeleteColumnButton />
      </div>
      {children}
      <AddTaskButton />
    </div>
  )
}