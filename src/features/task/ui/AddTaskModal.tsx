'use client'

import { useTaskStore } from '@/src/entities/task/model/taskStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/src/shared/ui/dialog'
import { Button } from '@/src/shared/ui/button'
import { Input } from '@/src/shared/ui/input'
import { Textarea } from '@/src/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { taskSchema, type TaskFormInput, type TaskFormOutput } from '@/src/entities/task/model/schema'

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
}

export const AddTaskModal = ({ open, onOpenChange, columnId }: AddTaskModalProps) => {
  const addTask = useTaskStore((state) => state.addTask)
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      tags: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (data: TaskFormOutput) => {
    addTask({
      ...data,
      columnId,
    })

    reset()
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 태스크 추가</DialogTitle>
          <DialogDescription>
            새로운 태스크의 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="태스크 제목을 입력하세요"
              {...register('title')}
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              설명
            </label>
            <Textarea
              id="description"
              placeholder="태스크 설명을 입력하세요 (선택사항)"
              {...register('description')}
              rows={3}
            />
          </div>

          {/* 우선순위 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">우선순위</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="우선순위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 낮음</SelectItem>
                    <SelectItem value="medium">🟡 보통</SelectItem>
                    <SelectItem value="high">🔴 높음</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              태그
            </label>
            <Input
              id="tags"
              placeholder="콤마로 구분 (예: bug, urgent, frontend)"
              {...register('tags')}
            />
            <p className="text-xs text-muted-foreground">
              여러 태그는 콤마(,)로 구분해주세요
            </p>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={!isValid}>
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
