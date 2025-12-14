import { BOARD_ID } from "@/src/shared/constants";
import { KanbanView } from "@/src/widgets/kanbanView";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full bg-color-background px-16 py-16">
        <KanbanView boardId={BOARD_ID.DEFAULT} />
      </main>
    </div>
  );
}
