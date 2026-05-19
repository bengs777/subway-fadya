"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Lock, Play, RefreshCw, Route, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { LevelDTO, UserProgressDTO } from "@/types/level";

const SubwayGame = dynamic(() => import("@/components/game/SubwayGame"), {
  ssr: false,
  loading: () => <div className="grid h-[calc(100vh-76px)] place-items-center text-xl font-black neon-text">Loading Subway Fadya...</div>
});

export function PlayClient() {
  const [mode, setMode] = useState<"menu" | "story" | "endless" | "game">("menu");
  const [selectedLevel, setSelectedLevel] = useState<LevelDTO | undefined>();
  const [levels, setLevels] = useState<LevelDTO[]>([]);
  const [progress, setProgress] = useState<UserProgressDTO | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadLevels() {
    setLoading(true);
    const [levelsRes, progressRes] = await Promise.all([
      fetch("/api/levels", { cache: "no-store" }),
      fetch("/api/player/progress", { cache: "no-store" })
    ]);
    const levelsJson = await levelsRes.json();
    const progressJson = await progressRes.json();
    if (levelsJson.ok) setLevels(levelsJson.data.levels);
    if (progressJson.ok) setProgress(progressJson.data);
    setLoading(false);
  }

  useEffect(() => {
    void loadLevels();
  }, []);

  if (mode === "game" && selectedLevel) {
    return <SubwayGame mode="story" level={selectedLevel} onExit={() => { void loadLevels(); setMode("story"); }} onStoryComplete={loadLevels} />;
  }

  if (mode === "endless") {
    return <SubwayGame mode="endless" onExit={() => setMode("menu")} />;
  }

  return (
    <section className="safe-area mx-auto min-h-[calc(100vh-76px)] max-w-7xl py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-200">Play</p>
          <h1 className="mt-2 text-4xl font-black neon-text">Subway Fadya Modes</h1>
        </div>
        <button className="game-button inline-flex items-center gap-2 px-4 font-bold" onClick={loadLevels}><RefreshCw size={16} />Refresh</button>
      </div>

      {mode === "menu" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ModeCard icon={Route} title="Story Mode" text="Pilih level, capai target distance, dapatkan reward, dan unlock stage berikutnya." onClick={() => setMode("story")} />
          <ModeCard icon={Zap} title="Endless Mode" text="Runner procedural tanpa batas dengan score scaling dan leaderboard global existing." onClick={() => setMode("endless")} />
        </div>
      )}

      {mode === "story" && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="glass rounded-lg p-5">
            <button className="mb-4 text-sm text-cyan-200" onClick={() => setMode("menu")}>Back to modes</button>
            <h2 className="text-2xl font-black">Progress</h2>
            <div className="mt-5 grid gap-3">
              <ProgressRow label="Current Level" value={progress?.currentLevel ?? 1} icon={Trophy} />
              <ProgressRow label="Total Stars" value={progress?.totalStars ?? 0} icon={Star} />
              <ProgressRow label="Completed" value={`${progress?.completionPercentage ?? 0}%`} icon={Route} />
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded bg-white/10">
              <div className="h-full bg-lime-300" style={{ width: `${progress?.completionPercentage ?? 0}%` }} />
            </div>
          </div>
          <div>
            {loading ? (
              <div className="glass rounded-lg p-8 text-center font-black">Loading levels...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {levels.map((level) => (
                  <LevelCard
                    key={level.id}
                    level={level}
                    onPlay={() => {
                      if (level.locked) return;
                      setSelectedLevel(level);
                      setMode("game");
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ModeCard({ icon: Icon, title, text, onClick }: { icon: typeof Route; title: string; text: string; onClick: () => void }) {
  return (
    <motion.button whileHover={{ y: -3 }} className="glass min-h-64 rounded-lg p-6 text-left" onClick={onClick}>
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100"><Icon size={24} /></div>
      <h2 className="mt-5 text-3xl font-black">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{text}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-black text-lime-200"><Play size={18} />Open</span>
    </motion.button>
  );
}

function LevelCard({ level, onPlay }: { level: LevelDTO; onPlay: () => void }) {
  return (
    <motion.button whileHover={level.locked ? undefined : { y: -3 }} className={`glass relative min-h-64 rounded-lg p-5 text-left ${level.locked ? "opacity-55" : ""}`} onClick={onPlay}>
      <div className="flex items-center justify-between">
        <span className="rounded-lg bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">Level {level.levelNumber}</span>
        {level.locked ? <Lock size={20} className="text-slate-300" /> : level.completed ? <Star size={20} className="fill-yellow-300 text-yellow-300" /> : <Play size={20} className="text-lime-200" />}
      </div>
      <h3 className="mt-5 text-2xl font-black">{level.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{level.description}</p>
      <div className="mt-5 grid gap-2 text-sm">
        <span>Target: <b>{level.requiredDistance.toLocaleString()}m</b></span>
        <span>Reward: <b className="text-yellow-200">{level.rewardCoins} coins</b></span>
        <span>Speed: <b>{level.speedMultiplier}x</b></span>
        <span>Environment: <b>{level.environmentType.replaceAll("_", " ")}</b></span>
      </div>
      <div className="mt-5 game-button grid place-items-center py-2 text-sm font-black">{level.locked ? `Unlock after Level ${level.unlockRequirement}` : "Play Level"}</div>
    </motion.button>
  );
}

function ProgressRow({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Trophy }) {
  return <div className="flex items-center justify-between rounded-lg bg-white/5 p-3"><span className="flex items-center gap-2 text-sm text-slate-300"><Icon size={16} />{label}</span><b>{value}</b></div>;
}
