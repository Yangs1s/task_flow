import { TASK_PRIORITY } from "../model/constant";
import { Priority } from "../model/types";
import { Badge } from "@/src/shared/ui/badge";

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  return (
    <Badge
      variant={priority as keyof typeof TASK_PRIORITY}
      className="rounded-md absolute top-4 right-4"
    >
      {TASK_PRIORITY[priority].label}
    </Badge>
  );
};
