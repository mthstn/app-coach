"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CycleType } from "@/lib/types";

export async function createCycle(clientId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Not authenticated");

  const type = String(formData.get("type") || "micro") as CycleType;
  const name = String(formData.get("name") || "").trim();
  const start_date = String(formData.get("start_date") || "").trim();
  const end_date = String(formData.get("end_date") || "").trim();
  const parent_cycle_id = String(formData.get("parent_cycle_id") || "").trim() || null;

  if (!name || !start_date || !end_date) throw new Error("Champs manquants");

  const { error } = await supabase.from("cycles").insert({
    owner_id: user.id,
    client_id: clientId,
    type,
    name,
    start_date,
    end_date,
    parent_cycle_id,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteCycle(clientId: string, cycleId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("cycles").delete().eq("id", cycleId);
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${clientId}`);
}
