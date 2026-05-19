import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionFromRequest(req);
    const achievements = await prisma.achievement.findMany({
      orderBy: { target: "asc" },
      include: user ? { users: { where: { userId: user.id } } } : undefined
    });
    return ok(achievements);
  } catch (error) {
    return handleError(error);
  }
}
