import { Coins, Gamepad2, ShoppingBag, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MetricCard, PageBand } from "@/components/ui/Cards";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const scores = user ? await prisma.score.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }) : [];
  return (
    <PageBand title={`Dashboard ${user?.username ?? ""}`}>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Coins} label="Coins" value={user?.coins ?? 0} />
        <MetricCard icon={Trophy} label="Highscore" value={user?.highscore ?? 0} />
        <MetricCard icon={Gamepad2} label="Matches" value={scores.length} />
        <MetricCard icon={ShoppingBag} label="Shop" value="Live" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="glass rounded-lg p-5"><h2 className="text-xl font-black">Recent Matches</h2><div className="mt-4 space-y-3">{scores.map((s) => <div key={s.id} className="flex justify-between rounded-lg bg-white/5 p-3 text-sm"><span>{s.score.toLocaleString()} pts</span><span>{s.distance}m</span><span>{s.coins} coins</span></div>)}</div></div>
        <div className="glass rounded-lg p-5"><h2 className="text-xl font-black">Ready?</h2><p className="mt-2 text-sm text-slate-300">Run, collect coins, unlock skins, and climb global leaderboard.</p><Link href="/play" className="game-button mt-5 block py-3 text-center font-black">Start Game</Link></div>
      </div>
    </PageBand>
  );
}
