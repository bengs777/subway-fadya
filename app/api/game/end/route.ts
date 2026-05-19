import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { endGameSchema } from "@/lib/validators/game";
import { sessionChecksum, validateRun } from "@/lib/game/security";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = endGameSchema.parse(await req.json());
    const session = await prisma.gameSession.findFirst({ where: { id: body.sessionId, userId: user.id, endTime: null } });
    if (!session) return fail("Game session not found.", 404);
    if (body.checksum !== sessionChecksum(user.id, session.seed, session.startTime)) return fail("Invalid session checksum.", 403);
    const valid = validateRun(body);
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.gameSession.update({
        where: { id: session.id },
        data: { endTime: new Date(), finalScore: body.score, distance: body.distance, coins: body.coins, valid }
      });
      if (valid) {
        await tx.score.create({ data: { userId: user.id, score: body.score, distance: body.distance, coins: body.coins } });
        const current = await tx.user.findUnique({ where: { id: user.id }, select: { highscore: true } });
        await tx.user.update({
          where: { id: user.id },
          data: { coins: { increment: body.coins }, highscore: { set: Math.max(body.score, current?.highscore ?? 0) } }
        });
        const fresh = await tx.user.findUnique({ where: { id: user.id }, select: { highscore: true, coins: true, _count: { select: { scores: true } } } });
        const achievements = await tx.achievement.findMany();
        for (const a of achievements) {
          const reached =
            (a.metric === "games" && (fresh?._count.scores ?? 0) >= a.target) ||
            (a.metric === "coins" && (fresh?.coins ?? 0) >= a.target) ||
            (a.metric === "highscore" && body.score >= a.target) ||
            (a.metric === "distance" && body.distance >= a.target);
          if (reached) await tx.userAchievement.upsert({ where: { userId_achievementId: { userId: user.id, achievementId: a.id } }, update: {}, create: { userId: user.id, achievementId: a.id } });
        }
      }
      return updated;
    });
    return ok({ ...result, accepted: valid });
  } catch (error) {
    return handleError(error);
  }
}
