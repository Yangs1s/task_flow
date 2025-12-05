'use client'

import { useState } from 'react'
import { useTaskStore } from '@/src/entities/task/model/taskStore'
import { Priority } from '@/src/entities/task/model/types'
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

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
}

export const AddTaskModal = ({ open, onOpenChange, columnId }: AddTaskModalProps) => {
  const addTask = useTaskStore((state) => state.addTask)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      columnId,
      priority,
    })
    
    // 폼 초기화 및 모달 닫기
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
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
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="태스크 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              설명
            </label>
            <Textarea
              id="description"
              placeholder="태스크 설명을 입력하세요 (선택사항)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* 우선순위 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">우선순위</label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="우선순위 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 낮음</SelectItem>
                <SelectItem value="medium">🟡 보통</SelectItem>
                <SelectItem value="high">🔴 높음</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

