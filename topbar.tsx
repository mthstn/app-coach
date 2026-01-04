import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function Topbar() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return (
    <div className="md:hidden mb-4">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white shadow-soft px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-zinc-950" />
          <div>
            <div className="text-sm font-semibold leading-tight">APP Planner</div>
            <div className="text-xs text-zinc-500 leading-tight truncate max-w-[160px]">{user?.email ?? "—"}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/clients" className="text-sm text-zinc-700 hover:text-zinc-950">Clients</Link>
          <Link href="/exercises" className="text-sm text-zinc-700 hover:text-zinc-950">Exos</Link>
        </div>
      </div>
    </div>
  );
}
