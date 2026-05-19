"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/api";

export async function updateUsername(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required.");
  const username = sanitizeText(String(formData.get("username") ?? ""));
  if (username.length < 3) throw new Error("Username is too short.");
  await prisma.user.update({ where: { id: user.id }, data: { username } });
  revalidatePath("/profile");
}
