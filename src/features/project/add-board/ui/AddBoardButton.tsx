"use client";
import { Button } from "@/src/shared/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AddBoardModal } from "../../ui/AddBoardModal";

export const AddBoardButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        보드
        <PlusIcon className="w-4 h-4" />
      </Button>
      <AddBoardModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
