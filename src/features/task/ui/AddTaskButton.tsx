'use client'

import { useState } from 'react'
import { Button } from '@/src/shared/ui/button'
import { PlusIcon } from 'lucide-react'
import { AddTaskModal } from './AddTaskModal'

interface AddTaskButtonProps {
  columnId: string
}

export const AddTaskButton = ({ columnId }: AddTaskButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <PlusIcon className="w-4 h-4" />
        <span className="ml-1">태스크 추가</span>
      </Button>
      
      <AddTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        columnId={columnId}
      />
    </>
  )
}
