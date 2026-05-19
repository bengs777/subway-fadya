import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const buySchema = z.object({ itemId: z.string().min(1) });

export async function GET() {
  try {
    return ok(await prisma.item.findMany({ where: { active: true }, orderBy: [{ type: "asc" }, { price: "asc" }] }));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const { itemId } = buySchema.parse(await req.json());
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item || !item.active) return fail("Item unavailable.", 404);
    const result = await prisma.$transaction(async (tx) => {
      const buyer = await tx.user.findUnique({ where: { id: user.id }, select: { coins: true } });
      if (!buyer || buyer.coins < item.price) throw new Error("Not enough coins.");
      await tx.user.update({ where: { id: user.id }, data: { coins: { decrement: item.price } } });
      return tx.inventory.upsert({
        where: { userId_itemId: { userId: user.id, itemId } },
        update: { quantity: { increment: 1 } },
        create: { userId: user.id, itemId }
      });
    });
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
