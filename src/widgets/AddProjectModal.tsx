"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/src/shared/ui/dialog";
import { Input } from "@/src/shared/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  boardSchema,
  BoardFormInput,
} from "@/src/entities/project/model/schema";
import { Textarea } from "@/src/shared/ui/textarea";

interface AddProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProjectModal = ({
  isOpen,
  onOpenChange,
}: AddProjectModalProps) => {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const { register, handleSubmit } = useForm<BoardFormInput>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit = (data: BoardFormInput) => {
    console.log(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로젝트 추가</DialogTitle>
          <DialogDescription>프로젝트를 추가해주세요</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">제목</label>
            <Input id="title" {...register("title")} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">프로젝트 내용</label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="프로젝트 설명을 입력해주세요"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="startDate">시작일</label>
            <Input id="startDate" {...register("startDate")} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="endDate">종료일</label>
            <Input id="endDate" {...register("endDate")} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
