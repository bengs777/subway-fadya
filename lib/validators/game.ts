import { z } from "zod";

export const endGameSchema = z.object({
  sessionId: z.string().cuid(),
  score: z.number().int().min(0).max(2_000_000),
  distance: z.number().int().min(0).max(200_000),
  coins: z.number().int().min(0).max(20_000),
  elapsedMs: z.number().int().min(500).max(3_600_000),
  checksum: z.string().min(16).max(160)
});

export const scoreQuerySchema = z.object({
  range: z.enum(["global", "daily", "weekly", "monthly"]).default("global")
});
