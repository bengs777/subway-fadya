import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok, sanitizeText } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const profileSchema = z.object({ username: z.string().min(3).max(24).optional() });

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true, username: true, email: true, role: true, avatarUrl: true, coins: true, highscore: true,
        _count: { select: { scores: true, inventory: true, achievements: true } },
        scores: { orderBy: { createdAt: "desc" }, take: 8 }
      }
    });
    return ok(profile);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = profileSchema.parse(await req.json());
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: body.username ? { username: sanitizeText(body.username) } : {},
      select: { id: true, username: true, email: true, avatarUrl: true, coins: true, highscore: true }
    });
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
