import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const recent = await prisma.score.findMany({ take: 12, orderBy: { createdAt: "desc" }, include: { user: { select: { username: true } } } });
  const max = Math.max(1, ...recent.map((r) => r.score));
  return <PageBand title="Analytics"><div className="glass rounded-lg p-6"><h2 className="text-xl font-black">Recent Score Chart</h2><div className="mt-6 flex h-56 items-end gap-3">{recent.reverse().map((r) => <div key={r.id} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-cyan-300/70" style={{ height: `${Math.max(8, (r.score / max) * 200)}px` }} /><span className="max-w-20 truncate text-xs text-slate-400">{r.user.username}</span></div>)}</div></div></PageBand>;
}
