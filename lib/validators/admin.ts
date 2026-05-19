import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(2).max(80),
  type: z.enum(["SKIN", "POWERUP", "BOARD"]),
  imageUrl: z.string().min(1).max(500),
  price: z.number().int().min(0).max(999999),
  powerUpType: z.enum(["COIN_MAGNET", "SHIELD", "DOUBLE_SCORE", "SPEED_BOOST"]).optional().nullable(),
  active: z.boolean().optional()
});

export const achievementSchema = z.object({
  title: z.string().min(2).max(80),
  description: z.string().min(3).max(240),
  target: z.number().int().min(1),
  metric: z.string().min(2).max(40)
});

export const playerUpdateSchema = z.object({
  username: z.string().min(3).max(24).optional(),
  email: z.string().email().optional(),
  coins: z.number().int().min(0).optional(),
  highscore: z.number().int().min(0).optional(),
  role: z.enum(["ADMIN", "PLAYER"]).optional()
});
