import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/shared/ui/select";
import { useProjectStore } from "@/src/entities/project/model/projectStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const ProjectSelectBox = () => {
  const { projects, fetchProjects } = useProjectStore();
  const router = useRouter();
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const handleValueChange = (newProjectId: string) => {
    router.push(`/${newProjectId}`);
  };
  // TODO: 보드 목록 조회 후 추가
  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="프로젝트 관리" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
