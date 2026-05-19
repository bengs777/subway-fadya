import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { sessionChecksum } from "@/lib/game/security";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const seed = crypto.randomUUID();
    const startTime = new Date();
    const session = await prisma.gameSession.create({
      data: { userId: user.id, seed, startTime, checksum: sessionChecksum(user.id, seed, startTime) },
      select: { id: true, seed: true, startTime: true, checksum: true }
    });
    return ok(session);
  } catch (error) {
    return handleError(error);
  }
}
