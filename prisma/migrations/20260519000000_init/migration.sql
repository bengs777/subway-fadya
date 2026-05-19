CREATE TYPE "Role" AS ENUM ('ADMIN', 'PLAYER');
CREATE TYPE "ItemType" AS ENUM ('SKIN', 'POWERUP', 'BOARD');
CREATE TYPE "PowerUpType" AS ENUM ('COIN_MAGNET', 'SHIELD', 'DOUBLE_SCORE', 'SPEED_BOOST');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'PLAYER',
  "avatarUrl" TEXT,
  "coins" INTEGER NOT NULL DEFAULT 0,
  "highscore" INTEGER NOT NULL DEFAULT 0,
  "refreshHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Score" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "distance" INTEGER NOT NULL,
  "coins" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Achievement" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "target" INTEGER NOT NULL DEFAULT 1,
  "metric" TEXT NOT NULL DEFAULT 'games',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserAchievement" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "achievementId" TEXT NOT NULL,
  "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Inventory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Item" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "ItemType" NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "powerUpType" "PowerUpType",
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GameSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endTime" TIMESTAMP(3),
  "finalScore" INTEGER,
  "distance" INTEGER NOT NULL DEFAULT 0,
  "coins" INTEGER NOT NULL DEFAULT 0,
  "seed" TEXT NOT NULL,
  "checksum" TEXT NOT NULL,
  "valid" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_highscore_idx" ON "User"("highscore" DESC);
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt");
CREATE INDEX "Score_score_idx" ON "Score"("score" DESC);
CREATE INDEX "Score_userId_createdAt_idx" ON "Score"("userId", "createdAt");
CREATE UNIQUE INDEX "Achievement_title_key" ON "Achievement"("title");
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");
CREATE UNIQUE INDEX "Inventory_userId_itemId_key" ON "Inventory"("userId", "itemId");
CREATE INDEX "Item_type_idx" ON "Item"("type");
CREATE INDEX "GameSession_userId_startTime_idx" ON "GameSession"("userId", "startTime");

ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
