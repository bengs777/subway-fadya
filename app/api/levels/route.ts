import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { handleError, ok } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionFromRequest(req);
    const [levels, progress] = await Promise.all([
      prisma.level.findMany({ orderBy: { levelNumber: "asc" } }),
      user ? prisma.userProgress.findUnique({ where: { userId: user.id } }) : null
    ]);
    const unlockedThrough = progress?.currentLevel ?? 1;
    return ok({
      levels: levels.map((level) => ({
        ...level,
        locked: level.levelNumber > unlockedThrough,
        completed: level.levelNumber <= (progress?.completedLevel ?? 0)
      })),
      progress
    });
  } catch (error) {
    return handleError(error);
  }
}
