import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const file = (await req.formData()).get("avatar");
    if (!(file instanceof File)) throw new Error("Avatar file is required.");
    const url = await uploadImage("avatars", `${user.id}/avatar.webp`, file);
    const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: url }, select: { avatarUrl: true } });
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
