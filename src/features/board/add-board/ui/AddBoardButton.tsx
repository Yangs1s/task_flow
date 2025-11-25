'use client'
import { Button } from "@/src/shared/ui/button";
import { PlusIcon } from "lucide-react";

export const AddBoardButton = () => {
  const handleAddBoard = () => {
    // 보드 추가 로직 (나중에 구현)
    console.log("보드 추가");
  };

  return (
    <Button onClick={handleAddBoard}>
      보드
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
};

