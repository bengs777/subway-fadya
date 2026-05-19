import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { requireEnv } from "@/lib/env";

const imageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxBytes = 3 * 1024 * 1024;

export const storageBuckets = ["avatars", "skins", "game-assets", "player-uploads", "screenshots"] as const;
export type StorageBucket = (typeof storageBuckets)[number];

export function supabaseAdmin() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false }
  });
}

export async function validateAndCompressImage(file: File) {
  if (!imageTypes.has(file.type)) throw new Error("Only PNG, JPEG, and WebP images are allowed.");
  if (file.size > maxBytes) throw new Error("Image must be 3MB or smaller.");
  const input = Buffer.from(await file.arrayBuffer());
  const compressed = await sharp(input)
    .rotate()
    .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return compressed;
}

export async function uploadImage(bucket: StorageBucket, path: string, file: File, isPrivate = false) {
  const client = supabaseAdmin();
  const compressed = await validateAndCompressImage(file);
  const cleanPath = path.replace(/[^a-zA-Z0-9/_\-.]/g, "-");
  const { error } = await client.storage.from(bucket).upload(cleanPath, compressed, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: true
  });
  if (error) throw new Error(error.message);
  if (isPrivate) {
    const { data, error: signedError } = await client.storage.from(bucket).createSignedUrl(cleanPath, 60 * 60);
    if (signedError) throw new Error(signedError.message);
    return data.signedUrl;
  }
  return client.storage.from(bucket).getPublicUrl(cleanPath).data.publicUrl;
}
