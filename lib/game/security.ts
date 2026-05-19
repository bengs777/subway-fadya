import { createHash } from "crypto";

export function sessionChecksum(userId: string, seed: string, startedAt: Date) {
  return createHash("sha256").update(`${userId}:${seed}:${startedAt.toISOString()}`).digest("hex");
}

export function validateRun({ score, distance, coins, elapsedMs }: { score: number; distance: number; coins: number; elapsedMs: number }) {
  const seconds = elapsedMs / 1000;
  const maxDistance = seconds * 42 + 140;
  const maxCoins = seconds * 10 + 80;
  const maxScore = distance * 14 + coins * 250 + seconds * 300;
  return distance <= maxDistance && coins <= maxCoins && score <= maxScore;
}
