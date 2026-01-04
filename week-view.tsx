import Link from "next/link";
import { format, parseISO, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import type { Session } from "@/lib/types";
import { sessionLoadPlanned } from "@/lib/training";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WeekView({
  clientId,
  startISO,
  sessionsByDay,
}: {
  clientId: string;
  startISO: string; // Monday
  sessionsByDay: Record<string, Session[]>;
}) {
  const start = parseISO(startISO);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[920px] grid grid-cols-7 gap-3">
        {days.map((d) => {
          const iso = format(d, "yyyy-MM-dd");
          const label = format(d, "EEE d", { locale: fr });
          const list = sessionsByDay[iso] ?? [];

          return (
            <div key={iso} className="rounded-2xl border border-zinc-200 bg-white shadow-soft">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200">
                <div className="text-sm font-semibold capitalize">{label}</div>
                <Link href={`/clients/${clientId}/sessions/new?date=${iso}`}>
                  <Button variant="ghost" size="sm">+ séance</Button>
                </Link>
              </div>
              <div className="p-3 space-y-2">
                {list.length ? (
                  list
                    .sort((a, b) => a.order_in_day - b.order_in_day)
                    .map((s) => (
                      <div key={s.id} className="rounded-xl border border-zinc-200 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold">
                            {s.kind === "run" ? "🏃 Running" : s.kind === "strength" ? "🏋️ Renfo" : "🛌 Repos"}
                            {s.order_in_day > 0 ? <span className="text-xs text-zinc-500"> • #{s.order_in_day + 1}</span> : null}
                          </div>
                          <Badge>
                            Charge: {sessionLoadPlanned(s)}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600">
                          {s.kind === "rest" ? (
                            "Repos"
                          ) : (
                            <>
                              {s.duration_min_planned ?? 0} min • RPE {s.rpe_planned ?? 0}
                            </>
                          )}
                        </div>
                        {s.notes ? <div className="mt-1 text-xs text-zinc-500 line-clamp-2">{s.notes}</div> : null}
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <form action={`/clients/${clientId}/sessions/${s.id}/delete`} method="post">
                            <button className="text-xs text-zinc-600 hover:text-zinc-950">Supprimer</button>
                          </form>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-xs text-zinc-500">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
