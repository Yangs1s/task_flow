import { supabase } from "@/src/shared/lib/supabase";
import { getSessionId } from "@/src/shared/lib/session";
import { Project } from "../model/types";
export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      // .eq("session_id", getSessionId())
      .order("created_at", { ascending: false });
    if (error) throw error;
    // console.log("프로젝트 불러오기 성공", data);
    return data;
  },
  createProject: async (project: Project): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
