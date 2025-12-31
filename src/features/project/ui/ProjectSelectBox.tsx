import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/shared/ui/select";
import { useProjectStore } from "@/src/entities/project/model/projectStore";
import { useEffect } from "react";

export const ProjectSelectBox = () => {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  // TODO: 보드 목록 조회 후 추가
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="프로젝트 관리" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 보드</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
