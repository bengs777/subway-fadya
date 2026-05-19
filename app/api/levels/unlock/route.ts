import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { unlockLevelSchema } from "@/lib/validators/levels";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const { levelNumber } = unlockLevelSchema.parse(await req.json());
    const level = await prisma.level.findUnique({ where: { levelNumber } });
    if (!level) return fail("Level not found.", 404);
    const progress = await prisma.userProgress.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });
    if (progress.completedLevel < level.unlockRequirement) return fail("Unlock requirement is not met.", 403);
    const updated = await prisma.userProgress.update({
      where: { userId: user.id },
      data: { currentLevel: Math.max(progress.currentLevel, levelNumber) }
    });
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
