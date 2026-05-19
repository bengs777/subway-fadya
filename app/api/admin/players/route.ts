import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { playerUpdateSchema } from "@/lib/validators/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const players = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, email: true, role: true, coins: true, highscore: true, avatarUrl: true, createdAt: true, _count: { select: { scores: true } } }
    });
    return ok(players);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Player id is required.");
    const body = playerUpdateSchema.parse(await req.json());
    return ok(await prisma.user.update({ where: { id }, data: body, select: { id: true, username: true, email: true, role: true, coins: true, highscore: true } }));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Player id is required.");
    await prisma.user.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
