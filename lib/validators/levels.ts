import { z } from "zod";

export const completeLevelSchema = z.object({
  levelNumber: z.number().int().min(1).max(100),
  score: z.number().int().min(0).max(2_000_000),
  distance: z.number().int().min(0).max(200_000),
  coins: z.number().int().min(0).max(20_000),
  elapsedMs: z.number().int().min(500).max(3_600_000)
});

export const unlockLevelSchema = z.object({
  levelNumber: z.number().int().min(1).max(100)
});
