import Link from "next/link";
import { Users, Dumbbell, LogOut, CalendarDays } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function Sidebar() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-4">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-soft p-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-zinc-950" />
            <div>
              <div className="text-sm font-semibold leading-tight">APP Planner</div>
              <div className="text-xs text-zinc-500 leading-tight">Coach workspace</div>
            </div>
          </div>
          <nav className="mt-4 space-y-1 text-sm">
            <NavItem href="/clients" icon={<Users size={16} />} label="Clients" />
            <NavItem href="/exercises" icon={<Dumbbell size={16} />} label="Banque d'exercices" />
          </nav>
          <div className="mt-4 border-t border-zinc-200 pt-3">
            <div className="text-xs text-zinc-500">Connecté</div>
            <div className="text-sm truncate">{user?.email ?? "—"}</div>
            <form action="/auth/signout" method="post" className="mt-3">
              <button className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-950">
                <LogOut size={16} /> Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
