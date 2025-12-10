"use client";

import { Badge } from "@/src/shared/ui/badge";
import { Task } from "../model/types";
import { PriorityBadge } from "./PriorityBadge";

export const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  tags,
}: Task) => {
  return (
    <div className="bg-muted cursor-pointer flex flex-col relative text-muted-foreground border border-border p-3 rounded-md shadow-sm hover:bg-accent transition-colors h-[160px]">
      <PriorityBadge priority={priority} />
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      <p>{description}</p>
      {dueDate && (
        <p className="absolute bottom-4 left-4">
          마감: {dueDate.toLocaleDateString()}
        </p>
      )}
      <div className="flex flex-wrap gap-2 absolute bottom-4 left-4">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-cyan-500 text-white rounded-md"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
