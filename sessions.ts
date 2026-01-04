"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionKind } from "@/lib/types";

export async function createSession(clientId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Not authenticated");

  const date = String(formData.get("date") || "").trim();
  const order_in_day = Number(formData.get("order_in_day") || 0);
  const kind = String(formData.get("kind") || "run") as SessionKind;
  const duration_min_planned = Number(formData.get("duration_min_planned") || 0);
  const rpe_planned = Number(formData.get("rpe_planned") || 0);
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!date) throw new Error("Date requise");

  const { data: inserted, error } = await supabase
    .from("sessions")
    .insert({
      owner_id: user.id,
      client_id: clientId,
      date,
      order_in_day,
      kind,
      duration_min_planned,
      rpe_planned,
      notes,
      status: "planned",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (kind === "run") {
    const run_type = String(formData.get("run_type") || "EF");
    const distance_km_raw = String(formData.get("distance_km") || "").trim();
    const distance_km = distance_km_raw ? Number(distance_km_raw) : null;
    const workout_json_raw = String(formData.get("workout_json") || "").trim();
    const workout_json = workout_json_raw ? JSON.parse(workout_json_raw) : null;

    const { error: e2 } = await supabase.from("run_details").insert({
      session_id: inserted.id,
      run_type,
      distance_km,
      workout_json,
    });
    if (e2) throw new Error(e2.message);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteSession(clientId: string, sessionId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${clientId}`);
}
