import { Button } from "@/src/shared/ui/button"
import { PlusIcon } from "lucide-react"
export const AddBoardButton = () => {
  return (
    <div>
      <Button>
        보드
        <PlusIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}