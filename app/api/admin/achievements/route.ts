import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { achievementSchema } from "@/lib/validators/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    return ok(await prisma.achievement.findMany({ orderBy: { createdAt: "desc" } }));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    return ok(await prisma.achievement.create({ data: achievementSchema.parse(await req.json()) }));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Achievement id is required.");
    return ok(await prisma.achievement.update({ where: { id }, data: achievementSchema.partial().parse(await req.json()) }));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Achievement id is required.");
    await prisma.achievement.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
