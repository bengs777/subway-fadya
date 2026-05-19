import Link from "next/link";
import { Coins, Gamepad2, Package, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MetricCard, PageBand } from "@/components/ui/Cards";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [players, matches, items, coins] = await Promise.all([
    prisma.user.count(),
    prisma.gameSession.count(),
    prisma.item.count(),
    prisma.user.aggregate({ _sum: { coins: true } })
  ]);
  return (
    <PageBand title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Users} label="Players" value={players} />
        <MetricCard icon={Gamepad2} label="Matches" value={matches} />
        <MetricCard icon={Package} label="Items" value={items} />
        <MetricCard icon={Coins} label="Revenue" value={coins._sum.coins ?? 0} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link className="game-button py-4 text-center font-black" href="/admin/players">User Management</Link>
        <Link className="game-button py-4 text-center font-black" href="/admin/items">Item Management</Link>
        <Link className="game-button py-4 text-center font-black" href="/admin/analytics">Analytics</Link>
      </div>
    </PageBand>
  );
}
