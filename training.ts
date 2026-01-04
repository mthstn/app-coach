import { differenceInCalendarDays, endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import type { Session } from "@/lib/types";

export function isoToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function weekRangeISO(anchorISO: string) {
  const d = parseISO(anchorISO);
  const start = startOfWeek(d, { weekStartsOn: 1 });
  const end = endOfWeek(d, { weekStartsOn: 1 });
  return { startISO: format(start, "yyyy-MM-dd"), endISO: format(end, "yyyy-MM-dd") };
}

export function daysUntil(fromISO: string, toISO: string): number {
  return differenceInCalendarDays(parseISO(toISO), parseISO(fromISO));
}

export function sessionLoadPlanned(s: Pick<Session, "kind" | "duration_min_planned" | "rpe_planned">): number {
  if (s.kind === "rest") return 0;
  const dur = s.duration_min_planned ?? 0;
  const rpe = s.rpe_planned ?? 0;
  return Math.max(0, dur) * Math.max(0, rpe);
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function monotony(dailyLoads: number[]): number | null {
  const sd = stdev(dailyLoads);
  if (sd === 0) return null;
  return mean(dailyLoads) / sd;
}
