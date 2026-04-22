import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Background } from "./Background";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Background />
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-2 pt-4 pb-10 lg:px-6">
          <Topbar onMenu={() => setOpen(true)} title={title} />
          <div className="px-2 lg:px-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
