'use client'
import { Button } from "@/src/shared/ui/button"
import { PlusIcon } from "lucide-react"
export const AddTaskButton = () => {
  return (
    <Button variant="outline">
      <PlusIcon className="w-4 h-4 cursor-pointer" />
    </Button>
  )
}