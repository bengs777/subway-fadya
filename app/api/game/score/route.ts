import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const scores = await prisma.score.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 });
    return ok(scores);
  } catch (error) {
    return handleError(error);
  }
}
