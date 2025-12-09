'use client'
import { AddBoardButton } from "@/src/features/board/add-board";
import { Input } from "@/src/shared/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/shared/ui/select";
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="프로젝트 관리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 보드</SelectItem>
            </SelectContent>
          </Select>
          {/* features는 사용자 액션을 담당! */}
          <AddBoardButton />
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {/* <input
            type="text"
            placeholder="태스크 검색..."
            className="p-2 border rounded bg-white border-gray-300"
          /> */}

            <Input
              type="text"
              placeholder="태스크 검색..."
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
      </div>
    </header>
  );
}

