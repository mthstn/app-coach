"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = "/clients";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="text-sm text-zinc-600">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </div>
      <div>
        <label className="text-sm text-zinc-600">Mot de passe</label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </div>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
      <div className="text-xs text-zinc-500">
        Tu peux créer ton compte dans Supabase Auth (Email/Password), puis te connecter ici.
      </div>
    </form>
  );
}
