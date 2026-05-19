import { NextRequest } from "next/server";
import { clearAuthCookies, getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api";

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (user) await prisma.user.update({ where: { id: user.id }, data: { refreshHash: null } });
  await clearAuthCookies();
  return ok({ loggedOut: true });
}
