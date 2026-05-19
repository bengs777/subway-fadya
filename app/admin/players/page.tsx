import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const players = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, username: true, email: true, role: true, coins: true, highscore: true } });
  return <PageBand title="User Management"><div className="glass overflow-auto rounded-lg"><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-cyan-200"><tr><th className="p-3">Username</th><th>Email</th><th>Role</th><th>Coins</th><th>Highscore</th><th>ID</th></tr></thead><tbody>{players.map((p) => <tr key={p.id} className="border-t border-white/8"><td className="p-3 font-bold">{p.username}</td><td>{p.email}</td><td>{p.role}</td><td>{p.coins}</td><td>{p.highscore}</td><td className="text-xs text-slate-500">{p.id}</td></tr>)}</tbody></table></div></PageBand>;
}
