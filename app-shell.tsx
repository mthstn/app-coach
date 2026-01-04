import * as React from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-app py-4 md:py-6">
      <Topbar />
      <div className="flex gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
