import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/src/shared/ui/select"

export const BoardSelectBox = () => {
    // TODO: 보드 목록 조회 후 추가
    return (        
        <Select>
            <SelectTrigger>
            <SelectValue placeholder="프로젝트 관리" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">모든 보드</SelectItem>
            </SelectContent>
        </Select>
    )  
}