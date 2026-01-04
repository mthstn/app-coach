"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createClient(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Not authenticated");

  const full_name = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const sport = String(formData.get("sport") || "").trim() || null;
  const objective_name = String(formData.get("objective_name") || "").trim() || null;
  const objective_date = String(formData.get("objective_date") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!full_name) throw new Error("Nom requis");

  const { error } = await supabase.from("clients").insert({
    owner_id: user.id,
    full_name,
    email,
    sport,
    objective_name,
    objective_date,
    notes,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/clients");
}

export async function deleteClient(clientId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}
