"use client";
import { Button } from "@/src/shared/ui/button";
import { TrashIcon } from "lucide-react";

export const DeleteColumnButton = ({ columnId }: { columnId: string }) => {
  const handleDeleteColumn = () => {
    // TODO: 컬럼 삭제 모달 열기
    console.log(`컬럼 삭제 : ${columnId}`);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-destructive/10 cursor-pointer"
      onClick={handleDeleteColumn}
    >
      <TrashIcon className="w-4 h-4 text-destructive transition-colors hover:text-white " />
    </Button>
  );
};
