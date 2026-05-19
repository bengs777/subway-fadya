import { Package } from "lucide-react";
import { PageBand } from "@/components/ui/Cards";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  const inventory = user ? await prisma.inventory.findMany({ where: { userId: user.id }, include: { item: true } }) : [];
  return <PageBand title="Inventory"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{inventory.map(({ id, item, quantity }) => <div key={id} className="glass rounded-lg p-5"><Package className="text-cyan-200" /><h2 className="mt-3 text-xl font-black">{item.name}</h2><p className="text-sm text-slate-400">{item.type} x{quantity}</p></div>)}</div></PageBand>;
}
