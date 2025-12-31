"use client";

import { useColumnStore } from "@/src/entities/column/model/columnStore";
import { TaskColumn } from "@/src/entities/column/ui";
import { useMemo, useEffect } from "react";
import { AddTaskButton } from "@/src/features/task/ui";
import { AddColumnButton } from "@/src/features/column/ui";
import { TaskController } from "@/src/features/task/ui";
import { supabase } from "@/src/shared/lib/supabase";

interface BoardContainerProps {
  boardId: string;
}

export const KanbanView = ({ boardId }: BoardContainerProps) => {
  const allColumns = useColumnStore((state) => state.columns);
  const addColumn = useColumnStore((state) => state.addColumn);

  // 초기 컬럼 데이터 세팅 (컬럼이 없을 때만)
  useEffect(() => {
    if (allColumns.length === 0) {
      addColumn({ title: "📋 To Do", boardId, order: 0 });
      addColumn({ title: "🚧 In Progress", boardId, order: 1 });
      addColumn({ title: "✅ Done", boardId, order: 2 });
    }
  }, [allColumns.length, addColumn, boardId]);

  useEffect(() => {
    const fetchData = async () => {
      console.clear(); // 콘솔창 청소 (깔끔하게 보려고)
      console.log("🚀 Supabase 데이터 조회 시작!");

      // 1. Projects 조회
      const { data: projects, error: projectError } = await supabase
        .from("projects")
        .select("*");

      if (projectError) console.error("❌ 프로젝트 에러:", projectError);
      else console.log("✅ 1. Projects 테이블:", projects);

      // 2. Columns 조회
      const { data: columns, error: columnError } = await supabase
        .from("columns")
        .select("*");

      if (columnError) console.error("❌ 컬럼 에러:", columnError);
      else console.log("✅ 2. Columns 테이블:", columns);

      // 3. Tasks 조회
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("*");

      if (taskError) console.error("❌ 태스크 에러:", taskError);
      else console.log("✅ 3. Tasks 테이블:", tasks);

      // 4. [심화] 관계형 데이터 조회 (프로젝트 -> 컬럼 -> 태스크 한 번에 가져오기)
      // 외래키(Foreign Key) 연결이 잘 되어있어야만 작동합니다.
      const { data: allInOne, error: relationError } = await supabase.from(
        "projects"
      ).select(`
          *,
          columns (
            *,
            tasks (*)
          )
        `);

      if (relationError) {
        console.warn(
          "⚠️ 관계형 조회 실패 (Foreign Key 연결 확인 필요):",
          relationError.message
        );
      } else {
        console.log("✨ 4. [계층형 구조] 프로젝트 > 컬럼 > 태스크:", allInOne);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(() => {
    return [...allColumns].sort((a, b) => a.order - b.order);
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <TaskController />
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            footerSlot={<AddTaskButton columnId={column.id} />}
          />
        ))}
        <AddColumnButton />
      </div>
    </div>
  );
};
