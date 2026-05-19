import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/ui/AuthForm";

export default function LoginPage() {
  return <section className="safe-area grid min-h-[calc(100vh-64px)] place-items-center py-10"><div className="w-full"><Suspense fallback={<div className="text-center">Loading...</div>}><AuthForm mode="login" /></Suspense><p className="mt-4 text-center text-sm text-slate-400">Belum punya akun? <Link className="text-cyan-200" href="/register">Register</Link></p></div></section>;
}
