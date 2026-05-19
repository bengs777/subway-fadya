import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) return fail(error.issues[0]?.message ?? "Invalid request", 422);
  if (error instanceof Error) return fail(error.message, 400);
  return fail("Unexpected server error", 500);
}

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}
