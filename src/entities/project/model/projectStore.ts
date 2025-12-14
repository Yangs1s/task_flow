import { create } from "zustand";
import { Project, ProjectInput, ProjectUpdate } from "./types";
import { generateId } from "@/src/shared/lib/generateId";

interface ProjectStore {
  projects: Project[];
  addProject: (project: ProjectInput) => void;
  updateProject: (id: string, updates: ProjectUpdate) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: generateId("project"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ projects: [...get().projects, newProject] });
  },
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  getProject: (id) => get().projects.find((project) => project.id === id),
  reset: () => set({ projects: [] }),
}));
