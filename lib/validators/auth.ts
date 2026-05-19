import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().max(120),
  password: z.string().min(8).max(80)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional().default(false)
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8).max(80)
});
