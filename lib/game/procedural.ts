export type SpawnKind = "train" | "barrier" | "tunnel" | "fence" | "moving" | "coin" | "magnet" | "shield" | "doubleScore" | "speedBoost";

export type SpawnItem = {
  id: string;
  lane: -1 | 0 | 1;
  z: number;
  kind: SpawnKind;
  phase: number;
};

export type SpawnOptions = {
  mode?: "story" | "endless";
  levelNumber?: number;
};

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function storyObstacle(levelNumber: number, roll: number): SpawnKind {
  if (levelNumber === 1) return roll > 0.56 ? "coin" : "barrier";
  if (levelNumber === 2) return roll > 0.62 ? "coin" : roll > 0.28 ? "barrier" : "train";
  if (levelNumber === 3) return roll > 0.58 ? "coin" : roll > 0.26 ? "moving" : "train";
  if (levelNumber === 4) return roll > 0.56 ? "coin" : roll > 0.25 ? "tunnel" : "moving";
  return roll > 0.94 ? "speedBoost" : roll > 0.89 ? "doubleScore" : roll > 0.84 ? "shield" : roll > 0.78 ? "magnet" : roll > 0.42 ? "coin" : roll > 0.28 ? "barrier" : roll > 0.18 ? "moving" : roll > 0.08 ? "tunnel" : "train";
}

export function generateSpawns(seed: string, count = 90, options: SpawnOptions = {}) {
  const rnd = hash(seed);
  const lanes = [-1, 0, 1] as const;
  const spawns: SpawnItem[] = [];
  for (let i = 0; i < count; i += 1) {
    const z = -28 - i * 12;
    const lane = lanes[Math.floor(rnd() * lanes.length)];
    const roll = rnd();
    const kind: SpawnKind = options.mode === "story" && options.levelNumber
      ? storyObstacle(options.levelNumber, roll)
      :
      roll > 0.94 ? "speedBoost" :
      roll > 0.89 ? "doubleScore" :
      roll > 0.84 ? "shield" :
      roll > 0.78 ? "magnet" :
      roll > 0.43 ? "coin" :
      roll > 0.31 ? "barrier" :
      roll > 0.2 ? "fence" :
      roll > 0.1 ? "moving" :
      roll > 0.05 ? "tunnel" : "train";
    spawns.push({ id: `${seed}-${i}`, lane, z, kind, phase: rnd() * Math.PI * 2 });
    if (kind === "coin") {
      spawns.push({ id: `${seed}-${i}-b`, lane, z: z - 3.6, kind: "coin", phase: rnd() });
      spawns.push({ id: `${seed}-${i}-c`, lane, z: z - 7.2, kind: "coin", phase: rnd() });
    }
  }
  return spawns;
}
