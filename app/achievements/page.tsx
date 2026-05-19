import { Medal } from "lucide-react";
import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: { target: "asc" } });
  return <PageBand title="Achievements"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{achievements.map((a) => <div key={a.id} className="glass rounded-lg p-5"><Medal className="text-yellow-200" /><h2 className="mt-3 text-xl font-black">{a.title}</h2><p className="mt-2 text-sm text-slate-400">{a.description}</p></div>)}</div></PageBand>;
}
