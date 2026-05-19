import Link from "next/link";
import { ArrowRight, Coins, Shield, Sparkles, Trophy, Zap } from "lucide-react";
import { MetricCard } from "@/components/ui/Cards";

export default function HomePage() {
  return (
    <section className="safe-area mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-200">Modern futuristic subway city</p>
        <h1 className="mt-4 text-5xl font-black leading-tight neon-text sm:text-7xl">Subway Fadya</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">3D endless runner cepat dengan neon city, procedural subway, leaderboard, shop, inventory, achievement, dan admin panel full-stack.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/play" className="game-button inline-flex items-center gap-2 px-5 py-3 font-black">Play Game <ArrowRight size={18} /></Link>
          <Link href="/register" className="rounded-lg border border-white/15 px-5 py-3 font-bold text-slate-200 hover:bg-white/10">Create Account</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <MetricCard icon={Zap} label="Power-ups" value="4" />
          <MetricCard icon={Trophy} label="Lanes" value="3" />
          <MetricCard icon={Shield} label="Lives" value="3" />
        </div>
      </div>
      <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/10 bg-[#090d19] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(53,245,255,.32),transparent_24rem),linear-gradient(180deg,rgba(255,62,165,.1),transparent)]" />
        <div className="absolute inset-x-8 top-10 text-center">
          <div className="text-4xl font-black text-yellow-300 drop-shadow-[0_0_18px_rgba(255,216,79,.8)]">SUBWAY</div>
          <div className="text-7xl font-black text-pink-400 drop-shadow-[0_0_24px_rgba(255,62,165,.72)]">FADYA</div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-[520px] w-[260px] -translate-x-1/2">
          <div className="absolute bottom-28 left-1/2 h-48 w-40 -translate-x-1/2 rounded-[42%] bg-[#f3eadc] shadow-[0_0_55px_rgba(255,255,255,.18)]" />
          <div className="absolute bottom-70 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#ffd9bd]" />
          <div className="absolute bottom-86 left-[95px] h-5 w-5 rounded-full bg-black" />
          <div className="absolute bottom-86 right-[95px] h-5 w-5 rounded-full bg-black" />
          <div className="absolute bottom-20 left-1/2 h-14 w-64 -translate-x-1/2 rotate-[-7deg] rounded-lg border-4 border-yellow-300 bg-gradient-to-r from-cyan-400 via-pink-500 to-lime-300 shadow-[0_0_28px_rgba(53,245,255,.45)]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-around opacity-70">
          {[0,1,2].map((i) => <div key={i} className="h-56 w-2 origin-bottom rotate-12 bg-slate-500" />)}
        </div>
        <div className="absolute left-4 top-4 flex gap-2"><Badge icon={Coins} text="12,345" /><Badge icon={Sparkles} text="123" /></div>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3"><Link href="/shop" className="game-button py-3 text-center font-black">Shop</Link><Link href="/leaderboard" className="game-button py-3 text-center font-black">Leaderboard</Link></div>
      </div>
    </section>
  );
}

function Badge({ icon: Icon, text }: { icon: typeof Coins; text: string }) {
  return <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/55 px-3 py-2 font-black"><Icon size={18} className="text-yellow-300" />{text}</div>;
}
