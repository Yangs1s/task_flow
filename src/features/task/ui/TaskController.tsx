import { Input } from "@/src/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"

export const TaskController = () => {
    return (
        <div className="flex items-center space-x-4 w-full">
        {/* Search */}
          <Input
            className="w-full max-w-40"
            type="text"
            placeholder="태스크 검색"
          />
        {/* Priority Filter */}

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="모든 우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 우선순위</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="medium">보통</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
}