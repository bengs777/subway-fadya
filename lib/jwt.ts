import { jwtVerify } from "jose/jwt/verify";
import { requireEnv } from "@/lib/env";

export type SessionUser = { id: string; email: string; username: string; role: "ADMIN" | "PLAYER" };

function secret() {
  return new TextEncoder().encode(requireEnv("JWT_SECRET"));
}

export async function verifyAccessToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}
