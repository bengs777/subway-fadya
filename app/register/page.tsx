import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/ui/AuthForm";

export default function RegisterPage() {
  return <section className="safe-area grid min-h-[calc(100vh-64px)] place-items-center py-10"><div className="w-full"><Suspense fallback={<div className="text-center">Loading...</div>}><AuthForm mode="register" /></Suspense><p className="mt-4 text-center text-sm text-slate-400">Sudah punya akun? <Link className="text-cyan-200" href="/login">Login</Link></p></div></section>;
}
