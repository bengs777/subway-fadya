import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const scores = await prisma.score.findMany({ orderBy: { score: "desc" }, take: 50, include: { user: { select: { username: true, avatarUrl: true } } } });
  return <PageBand title="Leaderboard"><div className="glass overflow-hidden rounded-lg">{scores.map((s, i) => <div key={s.id} className="grid grid-cols-[56px_1fr_110px_90px] items-center border-b border-white/8 px-4 py-3 text-sm"><span className="font-black text-cyan-200">#{i + 1}</span><span>{s.user.username}</span><span className="font-black">{s.score}</span><span>{s.distance}m</span></div>)}</div></PageBand>;
}
