import Link from "next/link";
import { Coins, Gauge, Shield, Trophy, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const nav = [
  ["Play", "/play"],
  ["Dashboard", "/dashboard"],
  ["Leaderboard", "/leaderboard"],
  ["Shop", "/shop"],
  ["Inventory", "/inventory"]
] as const;

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="min-h-screen">
      <div className="grid-bg fixed inset-x-0 top-0 h-80 opacity-80" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/82 backdrop-blur-xl">
        <div className="safe-area mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10"><Gauge size={20} /></span>
            <span className="neon-text">Subway Fadya</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(([label, href]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">{label}</Link>)}
            {user?.role === "ADMIN" && <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-amber-200 hover:bg-white/10">Admin</Link>}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden items-center gap-2 rounded-lg border border-yellow-300/25 bg-yellow-300/10 px-3 py-2 text-sm font-bold sm:flex"><Coins size={16} />{user.coins}</div>
                <Link href="/profile" className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/8" aria-label="Profile"><UserRound size={18} /></Link>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white">Login</Link>
                <Link href="/register" className="game-button px-4 py-2 text-sm font-bold">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="safe-area relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-500">
        <span>Subway Fadya production build</span>
        <span className="flex items-center gap-2"><Shield size={14} /> JWT, Prisma, Neon, Supabase Storage</span>
        <span className="flex items-center gap-2"><Trophy size={14} /> Endless runner 3D</span>
      </footer>
    </div>
  );
}
