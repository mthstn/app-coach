"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { weekRangeISO, isoToday, sessionLoadPlanned, monotony, mean } from "@/lib/training";

function humanDay(iso: string) {
  return format(parseISO(iso), "EEEE d MMM", { locale: fr });
}

export async function generateWeeklyEmail(clientId: string, anchorISO?: string) {
  const supabase = createSupabaseServerClient();
  const today = anchorISO ?? isoToday();
  const { startISO, endISO } = weekRangeISO(today);

  const { data: client, error: e1 } = await supabase.from("clients").select("*").eq("id", clientId).single();
  if (e1) throw new Error(e1.message);

  const { data: sessions, error: e2 } = await supabase
    .from("sessions")
    .select("*")
    .eq("client_id", clientId)
    .gte("date", startISO)
    .lte("date", endISO)
    .order("date", { ascending: true })
    .order("order_in_day", { ascending: true });
  if (e2) throw new Error(e2.message);

  // Current cycles by date (best-effort)
  const { data: cycles } = await supabase
    .from("cycles")
    .select("*")
    .eq("client_id", clientId)
    .lte("start_date", today)
    .gte("end_date", today);

  const currentMicro = cycles?.find((c) => c.type === "micro")?.name ?? null;
  const currentMeso = cycles?.find((c) => c.type === "meso")?.name ?? null;
  const currentMacro = cycles?.find((c) => c.type === "macro")?.name ?? null;

  // Daily loads (Mon..Sun)
  const dayISO = (() => {
    const { startISO } = weekRangeISO(today);
    const start = parseISO(startISO);
    const arr: string[] = [];
    for (let i = 0; i < 7; i++) arr.push(format(new Date(start.getTime() + i * 86400000), "yyyy-MM-dd"));
    return arr;
  })();

  const loadsByDay = dayISO.map((d) => {
    const daySessions = (sessions ?? []).filter((s) => s.date === d);
    return daySessions.reduce((acc, s) => acc + sessionLoadPlanned(s), 0);
  });

  const weeklyLoad = loadsByDay.reduce((a, b) => a + b, 0);
  const mono = monotony(loadsByDay);
  const strain = mono == null ? null : weeklyLoad * mono;

  const daysToGoal =
    client.objective_date ? Math.max(0, Math.round((parseISO(client.objective_date).getTime() - parseISO(today).getTime()) / 86400000)) : null;

  const headerDates = `${format(parseISO(startISO), "d MMM", { locale: fr })} → ${format(parseISO(endISO), "d MMM yyyy", { locale: fr })}`;

  const subject = `Semaine du ${format(parseISO(startISO), "d MMM", { locale: fr })} | ${client.full_name}${
    client.objective_date ? ` | Objectif J-${daysToGoal}` : ""
  }`;

  const lines: string[] = [];
  lines.push(`Bonjour ${client.full_name.split(" ")[0] ?? ""},`);
  lines.push("");
  lines.push(`Voici le programme de la semaine (${headerDates}).`);
  const cycleLineParts = [
    currentMacro ? `Macro: ${currentMacro}` : null,
    currentMeso ? `Meso: ${currentMeso}` : null,
    currentMicro ? `Micro: ${currentMicro}` : null,
  ].filter(Boolean);
  if (cycleLineParts.length) lines.push(`Cycle actuel — ${cycleLineParts.join(" • ")}`);
  if (daysToGoal != null && client.objective_name) lines.push(`Objectif: ${client.objective_name} (J-${daysToGoal})`);
  lines.push("");

  for (const d of dayISO) {
    lines.push(`${humanDay(d)}:`);
    const ds = (sessions ?? []).filter((s) => s.date === d);
    if (!ds.length) {
      lines.push(`  - Repos / libre`);
    } else {
      for (const s of ds) {
        const kind = s.kind === "run" ? "Running" : s.kind === "strength" ? "Renfo" : "Repos";
        const load = sessionLoadPlanned(s);
        const detail = s.kind === "rest" ? "" : ` — ${s.duration_min_planned ?? 0}min, RPE ${s.rpe_planned ?? 0}, charge ${load}`;
        const order = s.order_in_day > 0 ? ` (#${s.order_in_day + 1})` : "";
        lines.push(`  - ${kind}${order}${detail}${s.notes ? ` — ${s.notes}` : ""}`);
      }
    }
    lines.push("");
  }

  lines.push(`Récap semaine (estimations):`);
  lines.push(`- Charge hebdo: ${weeklyLoad}`);
  lines.push(`- Monotonie: ${mono == null ? "—" : mono.toFixed(2)}`);
  lines.push(`- Strain: ${strain == null ? "—" : Math.round(strain)}`);
  lines.push("");
  lines.push(`Bonne semaine !`);
  lines.push(`Mathieu`);

  const body = lines.join("\n");

  return { subject, body, startISO, endISO };
}
