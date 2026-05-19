"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Shield, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { generateSpawns, SpawnItem } from "@/lib/game/procedural";
import { getEnvironmentConfig } from "@/lib/game/environments";
import { PowerUp, useGameStore } from "@/store/game-store";
import { LevelDTO } from "@/types/level";

const laneX = [-3.2, 0, 3.2];
const powerMap: Record<string, PowerUp> = { magnet: "magnet", shield: "shield", doubleScore: "doubleScore", speedBoost: "speedBoost" };

function Runner({ jumping, sliding }: { jumping: boolean; sliding: boolean }) {
  const lane = useGameStore((s) => s.lane);
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, laneX[lane + 1], 12, dt);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, jumping ? 1.7 : 0.55, 10, dt);
    group.current.scale.y = THREE.MathUtils.damp(group.current.scale.y, sliding ? 0.5 : 1, 10, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, lane * -0.08, 8, dt);
  });
  return (
    <group ref={group} position={[0, 0.55, 3.2]}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <capsuleGeometry args={[0.42, 0.88, 8, 16]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.44, 32, 24]} />
        <meshStandardMaterial color="#ffd9bd" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, -0.32, 0.05]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.25, 0.12, 0.62]} />
        <meshStandardMaterial color="#21d4ca" emissive="#083c3a" />
      </mesh>
      <mesh position={[0, -0.22, 0.39]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.05, 8, 18]} />
        <meshStandardMaterial color="#ff8b2b" />
      </mesh>
      <mesh position={[0, -0.22, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.05, 8, 18]} />
        <meshStandardMaterial color="#ff8b2b" />
      </mesh>
    </group>
  );
}

function Track({ environmentType }: { environmentType: string }) {
  const env = getEnvironmentConfig(environmentType);
  const ties = useMemo(() => Array.from({ length: 42 }, (_, i) => i), []);
  return (
    <group>
      <mesh receiveShadow position={[0, -0.08, -56]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 150]} />
        <meshStandardMaterial color={env.floor} roughness={0.82} />
      </mesh>
      {[-3.2, 0, 3.2].map((x) => (
        <group key={x}>
          <mesh position={[x - 0.55, 0.05, -55]}>
            <boxGeometry args={[0.12, 0.12, 145]} />
            <meshStandardMaterial color={env.rail} metalness={0.8} roughness={0.28} />
          </mesh>
          <mesh position={[x + 0.55, 0.05, -55]}>
            <boxGeometry args={[0.12, 0.12, 145]} />
            <meshStandardMaterial color={env.rail} metalness={0.8} roughness={0.28} />
          </mesh>
        </group>
      ))}
      {ties.map((i) => (
        <mesh key={i} position={[0, -0.01, 8 - i * 3.5]}>
          <boxGeometry args={[11, 0.12, 0.24]} />
          <meshStandardMaterial color="#5b4031" roughness={0.9} />
        </mesh>
      ))}
      {[-6.4, 6.4].map((x) => (
        <mesh key={x} position={[x, 1.7, -54]}>
          <boxGeometry args={[0.2, 3.8, 150]} />
          <meshStandardMaterial color={env.wall} />
        </mesh>
      ))}
    </group>
  );
}

function CityLights({ environmentType }: { environmentType: string }) {
  const env = getEnvironmentConfig(environmentType);
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const z = -8 - i * 5.2;
        return (
          <group key={i} position={[side * 6.1, 2.9, z]}>
            <mesh>
              <boxGeometry args={[0.12, 2.4, 1.4]} />
              <meshStandardMaterial color={i % 3 === 0 ? env.primaryLight : env.accentLight} emissive={i % 3 === 0 ? env.primaryLight : env.accentLight} emissiveIntensity={1.2} />
            </mesh>
            <pointLight color={i % 3 === 0 ? env.primaryLight : env.accentLight} intensity={0.8} distance={7} />
          </group>
        );
      })}
    </>
  );
}

function Particles({ environmentType }: { environmentType: string }) {
  const env = getEnvironmentConfig(environmentType);
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i * 3.1) * 6, 1 + (i % 7) * 0.42, -4 - i * 2.4]}>
          <sphereGeometry args={[0.025 + (i % 3) * 0.012, 8, 8]} />
          <meshBasicMaterial color={env.particleColor} transparent opacity={0.42} />
        </mesh>
      ))}
    </>
  );
}

function SpawnMesh({ item, z, environmentType }: { item: SpawnItem; z: number; environmentType: string }) {
  const env = getEnvironmentConfig(environmentType);
  const x = laneX[item.lane + 1] + (item.kind === "moving" ? Math.sin(z * 0.8 + item.phase) * 0.8 : 0);
  if (item.kind === "coin") {
    return (
      <Float speed={4} rotationIntensity={2} floatIntensity={0.3}>
        <mesh position={[x, 1.05, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.11, 16, 32]} />
          <meshStandardMaterial color="#ffd84f" emissive="#f2a900" emissiveIntensity={0.75} metalness={0.4} />
        </mesh>
      </Float>
    );
  }
  if (item.kind in powerMap) {
    return (
      <Float speed={5} floatIntensity={0.7}>
        <mesh position={[x, 1.15, z]}>
          <octahedronGeometry args={[0.48]} />
          <meshStandardMaterial color={item.kind === "shield" ? "#35f5ff" : item.kind === "magnet" ? "#ff3ea5" : "#8dff4b"} emissive="#ffffff" emissiveIntensity={0.35} />
        </mesh>
      </Float>
    );
  }
  const color = item.kind === "train" ? env.trainColor : item.kind === "tunnel" ? "#293042" : item.kind === "moving" ? env.accentLight : "#ffb238";
  const size: [number, number, number] = item.kind === "train" ? [2.4, 2.5, 4.8] : item.kind === "tunnel" ? [2.6, 3.6, 1.5] : [1.8, 1.1, 0.9];
  return (
    <mesh castShadow position={[x, size[1] / 2 - 0.04, z]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.4} metalness={0.35} />
    </mesh>
  );
}

function Scene({ seed, jumping, sliding, onCollect, mode, level }: { seed: string; jumping: boolean; sliding: boolean; onCollect: (kind: string) => void; mode: "story" | "endless"; level?: LevelDTO }) {
  const environmentType = level?.environmentType ?? "normal_station";
  const env = getEnvironmentConfig(environmentType);
  const status = useGameStore((s) => s.status);
  const speed = useGameStore((s) => s.speed);
  const addDistance = useGameStore((s) => s.addDistance);
  const hit = useGameStore((s) => s.hit);
  const tickPowerUps = useGameStore((s) => s.tickPowerUps);
  const lane = useGameStore((s) => s.lane);
  const spawns = useMemo(() => generateSpawns(seed, mode === "story" ? 180 : 140, { mode, levelNumber: level?.levelNumber }), [seed, mode, level?.levelNumber]);
  const offset = useRef(0);
  const collected = useRef(new Set<string>());

  useFrame((_, dt) => {
    if (status !== "running") return;
    offset.current += speed * dt;
    addDistance(speed * dt);
    tickPowerUps(dt);
    for (const item of spawns) {
      if (collected.current.has(item.id)) continue;
      const z = item.z + offset.current;
      const itemLane = item.kind === "moving" ? Math.round((laneX[item.lane + 1] + Math.sin(z * 0.8 + item.phase) * 0.8) / 3.2) : item.lane;
      if (z > 2.2 && z < 4.5 && itemLane === lane) {
        if (item.kind === "coin" || item.kind in powerMap) {
          collected.current.add(item.id);
          onCollect(item.kind);
        } else if (!(item.kind === "barrier" && jumping) && !(item.kind === "tunnel" && sliding)) {
          collected.current.add(item.id);
          hit();
        }
      }
    }
  });

  return (
    <>
      <color attach="background" args={[env.sky]} />
      <fog attach="fog" args={[env.fog, 14, 72]} />
      <ambientLight intensity={env.ambient} />
      <directionalLight position={[2, 7, 6]} intensity={env.directional} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3, 4]} color={env.primaryLight} intensity={1.4} distance={12} />
      <Stars radius={90} depth={30} count={900} factor={2} saturation={0} fade speed={0.7} />
      <Track environmentType={environmentType} />
      <CityLights environmentType={environmentType} />
      <Particles environmentType={environmentType} />
      <Runner jumping={jumping} sliding={sliding} />
      {spawns.map((item) => {
        const z = item.z + offset.current;
        return z > -105 && z < 13 && !collected.current.has(item.id) ? <SpawnMesh key={item.id} item={item} z={z} environmentType={environmentType} /> : null;
      })}
      <Html position={[0, 4.2, -18]} center>
        <div className="rounded-lg border border-cyan-300/30 bg-black/40 px-5 py-2 text-sm font-black tracking-[0.35em] text-cyan-100 shadow-[0_0_30px_rgba(53,245,255,0.25)]">SUBWAY FADYA</div>
      </Html>
    </>
  );
}

export default function SubwayGame({ mode = "endless", level, onExit, onStoryComplete }: { mode?: "story" | "endless"; level?: LevelDTO; onExit?: () => void; onStoryComplete?: () => void }) {
  const [jumping, setJumping] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [seed, setSeed] = useState("offline");
  const [posting, setPosting] = useState(false);
  const [storyResult, setStoryResult] = useState<{ rewardCoins: number; unlockedLevel?: LevelDTO | null } | null>(null);
  const storyStartedAt = useRef(Date.now());
  const storyPosted = useRef(false);
  const start = useGameStore((s) => s.start);
  const reset = useGameStore((s) => s.reset);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const collectCoin = useGameStore((s) => s.collectCoin);
  const activatePowerUp = useGameStore((s) => s.activatePowerUp);
  const game = useGameStore();

  useEffect(() => {
    reset();
    setStoryResult(null);
    storyPosted.current = false;
  }, [mode, level?.levelNumber, reset]);

  async function startRun() {
    setStoryResult(null);
    storyPosted.current = false;
    storyStartedAt.current = Date.now();
    if (mode === "story" && level) {
      setSeed(`story-${level.levelNumber}-${crypto.randomUUID()}`);
      start(undefined, { mode: "story", targetDistance: level.requiredDistance, speedMultiplier: level.speedMultiplier });
      return;
    }
    try {
      const res = await fetch("/api/game/start", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setSeed(json.data.seed);
        start({ id: json.data.id, checksum: json.data.checksum }, { mode: "endless", speedMultiplier: 1 });
        return;
      }
    } catch {}
    setSeed(crypto.randomUUID());
    start(undefined, { mode: "endless", speedMultiplier: 1 });
  }

  const submitRun = useCallback(async () => {
    if (!game.session || posting) return;
    setPosting(true);
    await fetch("/api/game/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: game.session.id,
        score: Math.floor(game.score),
        distance: Math.floor(game.distance),
        coins: game.coins,
        elapsedMs: Date.now() - game.session.startedAt,
        checksum: game.session.checksum
      })
    }).finally(() => setPosting(false));
  }, [game.coins, game.distance, game.score, game.session, posting]);

  useEffect(() => {
    if (game.status === "ended" && mode === "endless") void submitRun();
  }, [game.status, mode, submitRun]);

  useEffect(() => {
    async function completeStory() {
      if (!level || storyPosted.current) return;
      storyPosted.current = true;
      setPosting(true);
      const res = await fetch("/api/levels/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelNumber: level.levelNumber,
          score: Math.floor(game.score),
          distance: Math.floor(game.distance),
          coins: game.coins,
          elapsedMs: Date.now() - storyStartedAt.current
        })
      });
      const json = await res.json();
      if (json.ok) {
        setStoryResult({ rewardCoins: json.data.rewardCoins, unlockedLevel: json.data.unlockedLevel });
        onStoryComplete?.();
      }
      setPosting(false);
    }
    if (game.status === "completed" && mode === "story") void completeStory();
  }, [game.status, mode, level, game.score, game.distance, game.coins, onStoryComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") moveLeft();
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") moveRight();
      if (e.code === "Space") { setJumping(true); window.setTimeout(() => setJumping(false), 640); }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") { setSliding(true); window.setTimeout(() => setSliding(false), 620); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight]);

  const touch = useRef<{ x: number; y: number } | null>(null);
  function onCollect(kind: string) {
    if (kind === "coin") collectCoin();
    if (kind in powerMap) activatePowerUp(powerMap[kind], 9);
  }

  return (
    <div className="relative h-[calc(100vh-76px)] min-h-[620px] overflow-hidden rounded-none bg-black">
      <div
        className="absolute inset-0 z-10"
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 28) {
            if (dx < 0) moveLeft();
            else moveRight();
          }
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 28) {
            if (dy < 0) {
              setJumping(true);
              setTimeout(() => setJumping(false), 640);
            } else {
              setSliding(true);
              setTimeout(() => setSliding(false), 620);
            }
          }
          touch.current = null;
        }}
      />
      <Canvas shadows camera={{ position: [0, 4.6, 9.4], fov: 58 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
        <Scene seed={seed} jumping={jumping} sliding={sliding} onCollect={onCollect} mode={mode} level={level} />
      </Canvas>
      <GameHud onStart={startRun} onPause={pause} onResume={resume} onRestart={startRun} posting={posting} mode={mode} level={level} storyResult={storyResult} onExit={onExit} />
    </div>
  );
}

function GameHud({ onStart, onPause, onResume, onRestart, posting, mode, level, storyResult, onExit }: { onStart: () => void; onPause: () => void; onResume: () => void; onRestart: () => void; posting: boolean; mode: "story" | "endless"; level?: LevelDTO; storyResult: { rewardCoins: number; unlockedLevel?: LevelDTO | null } | null; onExit?: () => void }) {
  const game = useGameStore();
  const target = level?.requiredDistance;
  const progress = target ? Math.min(100, Math.round((game.distance / target) * 100)) : 0;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 safe-area">
      <div className="flex items-start justify-between pt-4">
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Stat label="Score" value={Math.floor(game.score)} />
          <Stat label="Coins" value={game.coins} />
          <Stat label="Meters" value={Math.floor(game.distance)} />
          <Stat label="Lives" value={game.lives} />
        </div>
        <div className="pointer-events-auto flex gap-2">
          {game.status === "running" && <button className="game-button grid h-11 w-11 place-items-center" onClick={onPause} aria-label="Pause"><Pause size={20} /></button>}
          {game.status === "paused" && <button className="game-button grid h-11 w-11 place-items-center" onClick={onResume} aria-label="Resume"><Play size={20} /></button>}
        </div>
      </div>
      {mode === "story" && level && (
        <div className="mt-3 max-w-md">
          <div className="glass rounded-lg p-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-cyan-100"><span>{level.name}</span><span>{progress}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      )}
      <div className="mt-3 flex gap-2 text-xs">
        {Object.entries(game.activePowerUps).filter(([, v]) => v > 0).map(([k, v]) => (
          <div key={k} className="glass flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-cyan-50"><Shield size={14} /> {k} {Math.ceil(v)}s</div>
        ))}
      </div>
      {game.status !== "running" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto absolute inset-0 grid place-items-center bg-black/45 px-4">
          <div className="glass max-w-md rounded-lg p-6 text-center">
            <div className="text-4xl font-black neon-text">{mode === "story" && level ? level.name : "Subway Fadya"}</div>
            <p className="mt-3 text-sm text-slate-300">{mode === "story" && level ? `${level.requiredDistance}m target • ${level.rewardCoins} coin reward` : "A/Left, D/Right, Space, S/Down. Swipe di mobile."}</p>
            {(game.status === "completed" || game.status === "ended") && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <Stat label="Score" value={Math.floor(game.score)} />
                <Stat label="Meters" value={Math.floor(game.distance)} />
                <Stat label="Coins" value={game.coins + (storyResult?.rewardCoins ?? 0)} />
              </div>
            )}
            {game.status === "completed" && <p className="mt-4 text-sm font-bold text-lime-200">Level complete. Reward {storyResult?.rewardCoins ?? level?.rewardCoins ?? 0} coins{storyResult?.unlockedLevel ? ` • Unlocked ${storyResult.unlockedLevel.name}` : ""}</p>}
            {game.status === "ended" && mode === "story" && <p className="mt-4 text-sm font-bold text-red-100">Run failed. Retry the level to unlock progress.</p>}
            <div className="mt-5 flex justify-center gap-3">
              {game.status === "idle" && <button className="game-button px-5 font-black" onClick={onStart}><Zap className="mr-2 inline" size={18} />{mode === "story" ? "Start Level" : "Start Run"}</button>}
              {game.status === "paused" && <button className="game-button px-5 font-black" onClick={onResume}>Continue</button>}
              {game.status === "ended" && <button className="game-button px-5 font-black" onClick={onRestart}><RotateCcw className="mr-2 inline" size={18} />Run Again</button>}
              {game.status === "completed" && <button className="game-button px-5 font-black" onClick={onExit}>Continue</button>}
              {mode === "story" && onExit && <button className="rounded-lg border border-white/15 px-5 font-bold" onClick={onExit}>Levels</button>}
            </div>
            {game.status === "ended" && <p className="mt-3 text-xs text-slate-400">{posting ? "Saving run..." : "Run saved when authenticated."}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="glass min-w-24 rounded-lg px-3 py-2"><div className="text-[10px] uppercase tracking-widest text-cyan-200">{label}</div><div className="text-xl font-black">{value.toLocaleString()}</div></div>;
}
