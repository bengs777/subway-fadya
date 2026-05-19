import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  return <PageBand title="Item Management"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item.id} className="glass rounded-lg p-5"><h2 className="text-xl font-black">{item.name}</h2><p className="mt-1 text-sm text-slate-400">{item.type} {item.powerUpType ?? ""}</p><p className="mt-3 font-black text-yellow-200">{item.price} coins</p><p className="mt-2 text-xs text-slate-500">{item.active ? "Active" : "Hidden"}</p></div>)}</div></PageBand>;
}
