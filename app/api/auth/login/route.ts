import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleError, ok } from "@/lib/api";
import { setAuthCookies, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`login:${req.headers.get("x-forwarded-for") ?? "local"}`, 8, 60_000)) return fail("Too many attempts.", 429);
    const body = loginSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.password))) return fail("Invalid credentials.", 401);
    const session = { id: user.id, email: user.email, username: user.username, role: user.role };
    await setAuthCookies(session, body.remember);
    return ok({ id: user.id, username: user.username, email: user.email, role: user.role, coins: user.coins, highscore: user.highscore });
  } catch (error) {
    return handleError(error);
  }
}
