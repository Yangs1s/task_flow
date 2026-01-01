import { create } from "zustand";
import { Task, TaskInput, TaskUpdate } from "./types";
import { generateId } from "@/src/shared/lib/generateId";
import { taskApi } from "../api/taskApi";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  fetchTasks: (columnId: string) => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  addTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (
    id: string,
    newColumnId: string,
    newOrder: number
  ) => Promise<void>;
  getTasksByColumn: (columnId: string) => Task[];
  reset: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (columnId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getTasks(columnId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchTasksByProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getTasksByProject(projectId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addTask: async (task) => {
    const newTask: Task = {
      ...task,
      id: generateId("task"),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: task.priority || "medium",
      tags: task.tags || [],
    };
    // 낙관적 업데이트
    set({ tasks: [...get().tasks, newTask] });
    try {
      const savedTask = await taskApi.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        tags: newTask.tags,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        columnId: newTask.columnId,
        order: newTask.order,
      });
      // 서버 응답으로 교체
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === newTask.id ? savedTask : t)),
      }));
    } catch (error) {
      // 실패 시 롤백
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== newTask.id),
        error: error as Error,
      }));
    }
  },

  updateTask: async (id, updates) => {
    const prevTasks = get().tasks;
    const hasUpdatedTask = prevTasks.find((task) => task.id === id);
    if (!hasUpdatedTask) return;

    // 낙관적 업데이트
    const updatedTask: Task = {
      ...hasUpdatedTask,
      ...updates,
      updatedAt: new Date(),
    };
    set({
      tasks: prevTasks.map((task) => (task.id === id ? updatedTask : task)),
    });

    try {
      await taskApi.updateTask(id, updates);
    } catch (error) {
      // 실패 시 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  deleteTask: async (id) => {
    const prevTasks = get().tasks;
    const hasDeletedTask = prevTasks.find((task) => task.id === id);
    if (!hasDeletedTask) return;

    // 낙관적 업데이트
    set({ tasks: prevTasks.filter((task) => task.id !== id) });

    try {
      await taskApi.deleteTask(id);
    } catch (error) {
      // 실패 시 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  moveTask: async (id, newColumnId, newOrder) => {
    const prevTasks = get().tasks;
    const movingTask = prevTasks.find((task) => task.id === id);
    if (!movingTask) return;

    // 낙관적 업데이트
    const updatedTask: Task = {
      ...movingTask,
      columnId: newColumnId,
      order: newOrder,
      updatedAt: new Date(),
    };
    set({
      tasks: prevTasks.map((task) => (task.id === id ? updatedTask : task)),
    });

    try {
      await taskApi.updateTask(id, { columnId: newColumnId, order: newOrder });
    } catch (error) {
      // 실패 시 롤백
      set({ tasks: prevTasks, error: error as Error });
    }
  },

  getTasksByColumn: (columnId) => {
    return get()
      .tasks.filter((task) => task.columnId === columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  reset: () => {
    set({ tasks: [], isLoading: false, error: null });
  },
}));
