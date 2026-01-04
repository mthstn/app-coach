export type SessionKind = "run" | "strength" | "rest";
export type CycleType = "macro" | "meso" | "micro";

export type Client = {
  id: string;
  owner_id: string;
  full_name: string;
  email: string | null;
  sport: string | null;
  objective_name: string | null;
  objective_date: string | null; // YYYY-MM-DD
  notes: string | null;
  created_at: string;
};

export type Cycle = {
  id: string;
  client_id: string;
  owner_id: string;
  type: CycleType;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  parent_cycle_id: string | null;
  created_at: string;
};

export type Session = {
  id: string;
  client_id: string;
  owner_id: string;
  date: string; // YYYY-MM-DD
  order_in_day: number;
  kind: SessionKind;
  duration_min_planned: number | null;
  rpe_planned: number | null;
  notes: string | null;
  status: "planned" | "done" | "skipped";
  created_at: string;
};

export type RunDetails = {
  session_id: string;
  run_type: "EF" | "SL" | "FRACTIONNE" | "INTERVALLE_MIX";
  distance_km: number | null;
  workout_json: any | null;
};

export type Exercise = {
  id: string;
  owner_id: string;
  name: string;
  tags: string[] | null;
  muscle_group: string | null;
  equipment: string | null;
  video_url: string | null;
  created_at: string;
};

export type StrengthItem = {
  id: string;
  session_id: string;
  exercise_id: string;
  sets: number | null;
  reps: string | null;
  rir: number | null;
  load_kg: number | null;
  tempo: string | null;
  rest_sec: number | null;
  notes: string | null;
  created_at: string;
};
