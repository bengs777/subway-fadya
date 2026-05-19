"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

type Mode = "login" | "register";
type AuthValues = { username?: string; email: string; password: string; remember?: boolean };

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm<AuthValues>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: mode === "login" ? { email: "", password: "", remember: true } : { username: "", email: "", password: "" }
  });

  async function onSubmit(values: AuthValues) {
    setError("");
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error);
      return;
    }
    router.push(search.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={form.handleSubmit(onSubmit)} className="glass mx-auto w-full max-w-md rounded-lg p-6">
      <h1 className="text-3xl font-black neon-text">{mode === "login" ? "Login" : "Register"}</h1>
      <p className="mt-2 text-sm text-slate-300">Masuk untuk menyimpan skor, coin, inventory, dan leaderboard.</p>
      <div className="mt-6 space-y-4">
        {mode === "register" && <Field label="Username" error={form.formState.errors.username?.message}><input {...form.register("username")} className="w-full rounded-lg border border-white/12 bg-black/35 px-3 py-3 outline-none focus:border-cyan-300" /></Field>}
        <Field label="Email" error={form.formState.errors.email?.message}><input type="email" {...form.register("email")} className="w-full rounded-lg border border-white/12 bg-black/35 px-3 py-3 outline-none focus:border-cyan-300" /></Field>
        <Field label="Password" error={form.formState.errors.password?.message}><input type="password" {...form.register("password")} className="w-full rounded-lg border border-white/12 bg-black/35 px-3 py-3 outline-none focus:border-cyan-300" /></Field>
        {mode === "login" && <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" {...form.register("remember")} /> Remember login</label>}
      </div>
      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>}
      <button className="game-button mt-6 w-full font-black" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 inline animate-spin" size={18} />}{mode === "login" ? "Login" : "Create Player"}</button>
    </motion.form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-slate-200"><span className="mb-2 block">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-200">{error}</span>}</label>;
}
