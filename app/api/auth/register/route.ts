import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok, sanitizeText } from "@/lib/api";
import { hashPassword, setAuthCookies } from "@/lib/auth";
import { registerSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`register:${req.headers.get("x-forwarded-for") ?? "local"}`, 5, 60_000)) return fail("Too many attempts.", 429);
    const body = registerSchema.parse(await req.json());
    const user = await prisma.user.create({
      data: {
        username: sanitizeText(body.username),
        email: body.email.toLowerCase(),
        password: await hashPassword(body.password)
      },
      select: { id: true, username: true, email: true, role: true, coins: true, highscore: true }
    });
    await setAuthCookies({ id: user.id, email: user.email, username: user.username, role: user.role });
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}
