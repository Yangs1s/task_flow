import { TaskColumn } from "@/src/entities/column/ui";
import { TaskCard } from "../src/entities/task/ui";
import { mockTasks } from "@/src/entities/task/model/mockData";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full bg-color-background px-16 py-16">
        <div className="grid grid-cols-3 grid-rows-4 w-full gap-4">
          <TaskColumn>
            {mockTasks.slice(0, 4).map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </TaskColumn>
        </div>
      </main>
    </div>
  );
}
 