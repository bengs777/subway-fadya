import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { scoreQuerySchema } from "@/lib/validators/game";

export async function GET(req: NextRequest) {
  try {
    const range = scoreQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams)).range;
    const since = new Date();
    if (range === "daily") since.setDate(since.getDate() - 1);
    if (range === "weekly") since.setDate(since.getDate() - 7);
    if (range === "monthly") since.setMonth(since.getMonth() - 1);
    const scores = await prisma.score.findMany({
      where: range === "global" ? {} : { createdAt: { gte: since } },
      orderBy: { score: "desc" },
      take: 50,
      include: { user: { select: { username: true, avatarUrl: true } } }
    });
    return ok(scores);
  } catch (error) {
    return handleError(error);
  }
}
