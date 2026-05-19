import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);

export function requireEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) throw new Error(`${name} is required for this operation.`);
  return value;
}
