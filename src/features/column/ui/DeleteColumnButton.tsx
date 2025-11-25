'use client'
import { Button } from "@/src/shared/ui/button"
import { TrashIcon} from "lucide-react"

export const DeleteColumnButton = () => {
  return (
    <Button variant="ghost" size="icon" className="hover:bg-destructive/10 cursor-pointer">
      <TrashIcon className="w-4 h-4 text-destructive transition-colors hover:text-white " />
    </Button>
  )
}