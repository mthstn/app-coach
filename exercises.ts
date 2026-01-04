"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createExercise(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Not authenticated");

  const name = String(formData.get("name") || "").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : null;
  const muscle_group = String(formData.get("muscle_group") || "").trim() || null;
  const equipment = String(formData.get("equipment") || "").trim() || null;
  const video_url = String(formData.get("video_url") || "").trim() || null;

  if (!name) throw new Error("Nom requis");

  const { error } = await supabase.from("exercises").insert({
    owner_id: user.id,
    name,
    tags,
    muscle_group,
    equipment,
    video_url,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/exercises");
}

export async function deleteExercise(exerciseId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("exercises").delete().eq("id", exerciseId);
  if (error) throw new Error(error.message);
  revalidatePath("/exercises");
}
