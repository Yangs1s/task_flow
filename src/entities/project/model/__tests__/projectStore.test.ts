import { renderHook, act } from "@testing-library/react";
import { useProjectStore } from "../projectStore";

describe("ProjectStore - 프로젝트 관리", () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    useProjectStore.getState().projects = [];
  });

  describe("초기 상태", () => {
    it("빈 배열로 시작해야 함", () => {
      const { result } = renderHook(() => useProjectStore());
      expect(result.current.projects).toEqual([]);
    });
  });

  describe("프로젝트 추가 (addProject)", () => {
    it("새 프로젝트를 추가할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({
          title: "New Project",
          description: "Project description",
        });
      });

      expect(result.current.projects).toHaveLength(1);
      expect(result.current.projects[0].title).toBe("New Project");
      expect(result.current.projects[0].description).toBe(
        "Project description"
      );
    });

    it("프로젝트에 자동으로 id가 부여되어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({
          title: "Project",
        });
      });

      expect(result.current.projects[0].id).toBeDefined();
      expect(typeof result.current.projects[0].id).toBe("string");
      expect(result.current.projects[0].id.length).toBeGreaterThan(0);
    });

    it("프로젝트에 createdAt, updatedAt이 자동으로 설정되어야 함", () => {
      const { result } = renderHook(() => useProjectStore());
      const before = new Date();

      act(() => {
        result.current.addProject({
          title: "Project",
        });
      });

      const after = new Date();
      const project = result.current.projects[0];

      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
      expect(project.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(project.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("여러 프로젝트를 추가할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project 1" });
        result.current.addProject({ title: "Project 2" });
        result.current.addProject({ title: "Project 3" });
      });

      expect(result.current.projects).toHaveLength(3);
      expect(result.current.projects[0].title).toBe("Project 1");
      expect(result.current.projects[1].title).toBe("Project 2");
      expect(result.current.projects[2].title).toBe("Project 3");
    });
  });

  describe("프로젝트 수정 (updateProject)", () => {
    it("프로젝트의 제목을 수정할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({
          title: "Original Title",
        });
      });

      const projectId = result.current.projects[0].id;

      act(() => {
        result.current.updateProject(projectId, {
          title: "Updated Title",
        });
      });

      expect(result.current.projects[0].title).toBe("Updated Title");
    });

    it("프로젝트의 설명을 수정할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({
          title: "Project",
          description: "Original",
        });
      });

      const projectId = result.current.projects[0].id;

      act(() => {
        result.current.updateProject(projectId, {
          description: "Updated Description",
        });
      });

      expect(result.current.projects[0].description).toBe(
        "Updated Description"
      );
    });

    it("수정 시 updatedAt이 갱신되어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({
          title: "Project",
        });
      });

      const projectId = result.current.projects[0].id;
      const originalUpdatedAt = result.current.projects[0].updatedAt;

      setTimeout(() => {
        act(() => {
          result.current.updateProject(projectId, {
            title: "Updated",
          });
        });

        expect(result.current.projects[0].updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      }, 10);
    });

    it("존재하지 않는 프로젝트 수정 시 아무 일도 일어나지 않아야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project" });
      });

      act(() => {
        result.current.updateProject("non-existent-id", {
          title: "Updated",
        });
      });

      expect(result.current.projects[0].title).toBe("Project");
    });
  });

  describe("프로젝트 삭제 (deleteProject)", () => {
    it("프로젝트를 삭제할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project" });
      });

      const projectId = result.current.projects[0].id;

      act(() => {
        result.current.deleteProject(projectId);
      });

      expect(result.current.projects).toHaveLength(0);
    });

    it("여러 프로젝트 중 특정 프로젝트만 삭제되어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project 1" });
        result.current.addProject({ title: "Project 2" });
        result.current.addProject({ title: "Project 3" });
      });

      const projectIdToDelete = result.current.projects[1].id;

      act(() => {
        result.current.deleteProject(projectIdToDelete);
      });

      expect(result.current.projects).toHaveLength(2);
      expect(result.current.projects[0].title).toBe("Project 1");
      expect(result.current.projects[1].title).toBe("Project 3");
    });

    it("존재하지 않는 프로젝트 삭제 시 아무 일도 일어나지 않아야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project" });
      });

      act(() => {
        result.current.deleteProject("non-existent-id");
      });

      expect(result.current.projects).toHaveLength(1);
    });
  });

  describe("프로젝트 조회 (getProject)", () => {
    it("ID로 특정 프로젝트를 조회할 수 있어야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project 1" });
        result.current.addProject({ title: "Project 2" });
      });

      const projectId = result.current.projects[1].id;
      const project = result.current.getProject(projectId);

      expect(project).toBeDefined();
      expect(project?.title).toBe("Project 2");
    });

    it("존재하지 않는 ID로 조회 시 undefined를 반환해야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project" });
      });

      const project = result.current.getProject("non-existent-id");

      expect(project).toBeUndefined();
    });
  });

  describe("Store 초기화 (reset)", () => {
    it("모든 프로젝트를 삭제해야 함", () => {
      const { result } = renderHook(() => useProjectStore());

      act(() => {
        result.current.addProject({ title: "Project 1" });
        result.current.addProject({ title: "Project 2" });
      });

      expect(result.current.projects).toHaveLength(2);

      act(() => {
        result.current.reset();
      });

      expect(result.current.projects).toEqual([]);
    });
  });
});
