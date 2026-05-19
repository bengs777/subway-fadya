"use client";

import { create } from "zustand";

export type PowerUp = "magnet" | "shield" | "doubleScore" | "speedBoost";
export type GameStatus = "idle" | "running" | "paused" | "ended" | "completed";
export type GameMode = "endless" | "story";

type GameState = {
  status: GameStatus;
  lane: -1 | 0 | 1;
  score: number;
  coins: number;
  distance: number;
  lives: number;
  combo: number;
  multiplier: number;
  speed: number;
  mode: GameMode;
  targetDistance?: number;
  speedMultiplier: number;
  activePowerUps: Record<PowerUp, number>;
  session?: { id: string; checksum: string; startedAt: number };
  reset: () => void;
  start: (session?: { id: string; checksum: string }, options?: { mode?: GameMode; targetDistance?: number; speedMultiplier?: number }) => void;
  end: () => void;
  pause: () => void;
  resume: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  collectCoin: (amount?: number) => void;
  addDistance: (meters: number) => void;
  hit: () => boolean;
  activatePowerUp: (type: PowerUp, duration: number) => void;
  tickPowerUps: (dt: number) => void;
};

const initialPowerUps: Record<PowerUp, number> = { magnet: 0, shield: 0, doubleScore: 0, speedBoost: 0 };

export const useGameStore = create<GameState>((set, get) => ({
  status: "idle",
  lane: 0,
  score: 0,
  coins: 0,
  distance: 0,
  lives: 3,
  combo: 0,
  multiplier: 1,
  speed: 17,
  mode: "endless",
  targetDistance: undefined,
  speedMultiplier: 1,
  activePowerUps: initialPowerUps,
  reset: () => set({ status: "idle", lane: 0, score: 0, coins: 0, distance: 0, lives: 3, combo: 0, multiplier: 1, speed: 17, mode: "endless", targetDistance: undefined, speedMultiplier: 1, activePowerUps: { ...initialPowerUps }, session: undefined }),
  start: (session, options) => set({ status: "running", lane: 0, score: 0, coins: 0, distance: 0, lives: 3, combo: 0, multiplier: 1, speed: 17 * (options?.speedMultiplier ?? 1), mode: options?.mode ?? "endless", targetDistance: options?.targetDistance, speedMultiplier: options?.speedMultiplier ?? 1, activePowerUps: { ...initialPowerUps }, session: session ? { ...session, startedAt: Date.now() } : undefined }),
  end: () => set({ status: "ended" }),
  pause: () => set({ status: "paused" }),
  resume: () => set({ status: "running" }),
  moveLeft: () => set((s) => ({ lane: Math.max(-1, s.lane - 1) as -1 | 0 | 1 })),
  moveRight: () => set((s) => ({ lane: Math.min(1, s.lane + 1) as -1 | 0 | 1 })),
  collectCoin: (amount = 1) => set((s) => {
    const bonus = s.activePowerUps.doubleScore > 0 ? 2 : 1;
    const combo = s.combo + amount;
    const multiplier = 1 + Math.min(4, Math.floor(combo / 12));
    return { coins: s.coins + amount, combo, multiplier, score: s.score + amount * 100 * multiplier * bonus };
  }),
  addDistance: (meters) => set((s) => {
    const speedBonus = s.activePowerUps.speedBoost > 0 ? 1.35 : 1;
    const distance = s.distance + meters * speedBonus;
    const completed = s.mode === "story" && s.targetDistance && distance >= s.targetDistance;
    return { distance, speed: Math.min(42, (17 + distance / 420) * s.speedMultiplier), score: s.score + Math.floor(meters * 12 * s.multiplier), status: completed ? "completed" : s.status };
  }),
  hit: () => {
    const s = get();
    if (s.activePowerUps.shield > 0) {
      set((state) => ({ activePowerUps: { ...state.activePowerUps, shield: 0 }, combo: 0 }));
      return false;
    }
    const lives = s.lives - 1;
    set({ lives, combo: 0, multiplier: 1 });
    if (lives <= 0) set({ status: "ended" });
    return lives <= 0;
  },
  activatePowerUp: (type, duration) => set((s) => ({ activePowerUps: { ...s.activePowerUps, [type]: Math.max(s.activePowerUps[type], duration) } })),
  tickPowerUps: (dt) => set((s) => ({
    activePowerUps: Object.fromEntries(Object.entries(s.activePowerUps).map(([k, v]) => [k, Math.max(0, v - dt)])) as Record<PowerUp, number>
  }))
}));
