import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("SubwayFadya!2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@subwayfadya.local" },
    update: {},
    create: {
      username: "adminfadya",
      email: "admin@subwayfadya.local",
      password,
      role: "ADMIN",
      coins: 5000
    }
  });

  const player = await prisma.user.upsert({
    where: { email: "player@subwayfadya.local" },
    update: {},
    create: {
      username: "fadya_runner",
      email: "player@subwayfadya.local",
      password,
      coins: 1200,
      highscore: 18500
    }
  });

  const items = [
    { name: "Neon Hoodie Fadya", type: "SKIN", imageUrl: "/textures/skin-neon.svg", price: 450 },
    { name: "Cyber Board", type: "BOARD", imageUrl: "/textures/board-cyber.svg", price: 350 },
    { name: "Coin Magnet", type: "POWERUP", imageUrl: "/textures/magnet.svg", price: 90, powerUpType: "COIN_MAGNET" },
    { name: "Shield", type: "POWERUP", imageUrl: "/textures/shield.svg", price: 120, powerUpType: "SHIELD" },
    { name: "Double Score", type: "POWERUP", imageUrl: "/textures/double-score.svg", price: 150, powerUpType: "DOUBLE_SCORE" },
    { name: "Speed Boost", type: "POWERUP", imageUrl: "/textures/speed.svg", price: 180, powerUpType: "SPEED_BOOST" }
  ] as const;

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.name.toLowerCase().replaceAll(" ", "-") },
      update: item,
      create: { id: item.name.toLowerCase().replaceAll(" ", "-"), ...item }
    });
  }

  const achievements = [
    { title: "First Run", description: "Finish your first subway run.", metric: "games", target: 1 },
    { title: "Coin Collector", description: "Collect 500 coins across runs.", metric: "coins", target: 500 },
    { title: "Distance Master", description: "Reach 5,000 meters total distance.", metric: "distance", target: 5000 },
    { title: "High Score Milestone", description: "Score 10,000 points in one run.", metric: "highscore", target: 10000 }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: achievement,
      create: achievement
    });
  }

  const levels = [
    { levelNumber: 1, name: "Metro Start", description: "Warm up in Fadya's neon subway station.", requiredDistance: 500, speedMultiplier: 1, rewardCoins: 100, environmentType: "normal_station", unlockRequirement: 0 },
    { levelNumber: 2, name: "Tunnel Rush", description: "Race through a darker tunnel with incoming trains.", requiredDistance: 1000, speedMultiplier: 1.2, rewardCoins: 150, environmentType: "dark_tunnel", unlockRequirement: 1 },
    { levelNumber: 3, name: "Neon District", description: "Survive moving hazards in the cyber city district.", requiredDistance: 1500, speedMultiplier: 1.4, rewardCoins: 250, environmentType: "neon_city", unlockRequirement: 2 },
    { levelNumber: 4, name: "Sky Rail", description: "Slide and dodge along elevated rails above the skyline.", requiredDistance: 2500, speedMultiplier: 1.7, rewardCoins: 400, environmentType: "sky_bridge", unlockRequirement: 3 },
    { levelNumber: 5, name: "Hyper City", description: "A high-speed mixed obstacle sprint through the future city.", requiredDistance: 4000, speedMultiplier: 2, rewardCoins: 600, environmentType: "future_city", unlockRequirement: 4 }
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { levelNumber: level.levelNumber },
      update: level,
      create: level
    });
  }

  for (const userId of [admin.id, player.id]) {
    await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  await prisma.score.createMany({
    data: [
      { userId: player.id, score: 18500, distance: 2810, coins: 210 },
      { userId: admin.id, score: 12500, distance: 1700, coins: 160 }
    ],
    skipDuplicates: true
  });

  console.log("Seed complete. Login with admin@subwayfadya.local / SubwayFadya!2026");
}

main().finally(async () => prisma.$disconnect());
