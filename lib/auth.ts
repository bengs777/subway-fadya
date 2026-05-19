import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEnv } from "@/lib/env";
import { SessionUser, verifyAccessToken } from "@/lib/jwt";

const accessCookie = "sf_access";
const refreshCookie = "sf_refresh";

function secret() {
  return new TextEncoder().encode(requireEnv("JWT_SECRET"));
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signToken(user: SessionUser, expiresIn = "20m") {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verifyToken(token?: string) {
  return verifyAccessToken(token);
}

export async function setAuthCookies(user: SessionUser, remember = false) {
  const cookieStore = await cookies();
  const refresh = crypto.randomUUID() + crypto.randomUUID();
  const refreshHash = await bcrypt.hash(refresh, 12);
  await prisma.user.update({ where: { id: user.id }, data: { refreshHash } });
  cookieStore.set(accessCookie, await signToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 20
  });
  cookieStore.set(refreshCookie, refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(accessCookie);
  cookieStore.delete(refreshCookie);
}

export async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(accessCookie)?.value;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = await verifyToken(cookieStore.get(accessCookie)?.value);
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, username: true, email: true, role: true, avatarUrl: true, coins: true, highscore: true }
  });
}

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(refreshCookie)?.value;
  if (!refresh) return null;
  const users = await prisma.user.findMany({
    where: { refreshHash: { not: null } },
    select: { id: true, email: true, username: true, role: true, refreshHash: true }
  });
  for (const user of users) {
    if (user.refreshHash && (await bcrypt.compare(refresh, user.refreshHash))) {
      const session = { id: user.id, email: user.email, username: user.username, role: user.role };
      cookieStore.set(accessCookie, await signToken(session), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 20
      });
      return session;
    }
  }
  return null;
}

export async function requireUser(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) throw new Error("Authentication required.");
  return user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);
  if (user.role !== "ADMIN") throw new Error("Admin access required.");
  return user;
}
