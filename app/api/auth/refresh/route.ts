import { fail, ok } from "@/lib/api";
import { refreshAccessToken } from "@/lib/auth";

export async function POST() {
  const session = await refreshAccessToken();
  if (!session) return fail("Refresh failed.", 401);
  return ok(session);
}
