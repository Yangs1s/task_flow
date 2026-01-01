import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/shared/ui/select";
import { useProjectStore } from "@/src/entities/project/model/projectStore";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export const ProjectSelectBox = () => {
  const { projects, fetchProjects } = useProjectStore();
  const router = useRouter();
  const params = useParams();
  const currentProjectId = params?.id as string | undefined;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleValueChange = (newProjectId: string) => {
    router.push(`/${newProjectId}`);
  };

  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <Select value={currentProjectId} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="프로젝트 선택">
          {currentProject?.title || "프로젝트 선택"}
        </SelectValue>
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
