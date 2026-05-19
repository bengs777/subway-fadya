import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const inventory = await prisma.inventory.findMany({ where: { userId: user.id }, include: { item: true }, orderBy: { createdAt: "desc" } });
    return ok(inventory);
  } catch (error) {
    return handleError(error);
  }
}
