'use client'

import { PlusIcon } from 'lucide-react'

export const AddColumnButton = () => {
  const handleAddColumn = () => {
    // TODO: 컬럼 추가 모달 열기
    console.log('컬럼 추가')
  }

  return (
    <button
      onClick={handleAddColumn}
      className="min-w-80 h-fit p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 flex items-center justify-center transition-colors">
        <PlusIcon className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary transition-colors" />
      </div>
      <span className="text-sm font-medium text-muted-foreground/70 group-hover:text-foreground transition-colors">
        새 컬럼 추가
      </span>
    </button>
  )
}
