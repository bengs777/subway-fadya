import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const progress = await prisma.userProgress.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });
    const levels = await prisma.level.count();
    return ok({
      ...progress,
      completionPercentage: levels ? Math.round((progress.completedLevel / levels) * 100) : 0
    });
  } catch (error) {
    return handleError(error);
  }
}
