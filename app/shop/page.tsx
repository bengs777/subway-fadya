import { ShoppingCart } from "lucide-react";
import { PageBand } from "@/components/ui/Cards";
import { prisma } from "@/lib/prisma";
import { BuyButton } from "@/components/ui/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const items = await prisma.item.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { price: "asc" }] });
  return <PageBand title="Shop"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item.id} className="glass rounded-lg p-5"><ShoppingCart className="text-lime-200" /><h2 className="mt-3 text-xl font-black">{item.name}</h2><p className="mt-1 text-sm text-slate-400">{item.type}</p><div className="mt-4 flex items-center justify-between"><span className="font-black text-yellow-200">{item.price} coins</span><BuyButton itemId={item.id} /></div></div>)}</div></PageBand>;
}
