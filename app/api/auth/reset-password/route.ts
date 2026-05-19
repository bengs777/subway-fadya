import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/lib/rate-limit";
import { fail } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`reset:${req.headers.get("x-forwarded-for") ?? "local"}`, 3, 60_000)) return fail("Too many attempts.", 429);
    const body = resetPasswordSchema.parse(await req.json());
    await prisma.user.update({
      where: { email: body.email.toLowerCase() },
      data: { password: await hashPassword(body.newPassword), refreshHash: null }
    });
    return ok({ updated: true });
  } catch (error) {
    return handleError(error);
  }
}
