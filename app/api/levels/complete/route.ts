import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { completeLevelSchema } from "@/lib/validators/levels";
import { validateRun } from "@/lib/game/security";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = completeLevelSchema.parse(await req.json());
    const level = await prisma.level.findUnique({ where: { levelNumber: body.levelNumber } });
    if (!level) return fail("Level not found.", 404);
    if (body.distance < level.requiredDistance) return fail("Target distance has not been reached.", 422);
    const valid = validateRun(body);
    if (!valid) return fail("Run failed anti-cheat validation.", 403);

    const result = await prisma.$transaction(async (tx) => {
      const progress = await tx.userProgress.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });
      if (level.levelNumber > progress.currentLevel) throw new Error("Level is locked.");
      const firstClear = level.levelNumber > progress.completedLevel;
      const completedLevel = Math.max(progress.completedLevel, level.levelNumber);
      const nextLevel = await tx.level.findUnique({ where: { levelNumber: level.levelNumber + 1 } });
      const currentLevel = nextLevel ? Math.max(progress.currentLevel, level.levelNumber + 1) : Math.max(progress.currentLevel, level.levelNumber);
      const stars = body.distance >= level.requiredDistance * 1.5 ? 3 : body.distance >= level.requiredDistance * 1.15 ? 2 : 1;
      const totalStars = Math.max(progress.totalStars, (completedLevel - 1) * 3 + stars);
      const rewardCoins = firstClear ? level.rewardCoins : 0;
      const currentUser = await tx.user.findUnique({ where: { id: user.id }, select: { highscore: true } });
      await tx.user.update({
        where: { id: user.id },
        data: { coins: { increment: rewardCoins + body.coins }, highscore: { set: Math.max(body.score, currentUser?.highscore ?? 0) } }
      });
      const updatedProgress = await tx.userProgress.update({
        where: { userId: user.id },
        data: { currentLevel, completedLevel, totalStars }
      });
      await tx.score.create({ data: { userId: user.id, score: body.score, distance: body.distance, coins: body.coins + rewardCoins } });
      return {
        progress: updatedProgress,
        level,
        rewardCoins,
        unlockedLevel: firstClear && nextLevel && currentLevel >= nextLevel.levelNumber ? nextLevel : null
      };
    });

    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
