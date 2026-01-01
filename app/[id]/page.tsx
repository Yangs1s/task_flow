import { KanbanView } from "@/src/widgets/kanbanView";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  console.log(id);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full bg-color-background px-16 py-16">
        <KanbanView projectId={id} />
      </main>
    </div>
  );
}
