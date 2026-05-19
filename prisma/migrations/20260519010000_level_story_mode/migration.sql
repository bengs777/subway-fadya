CREATE TABLE "Level" (
  "id" TEXT NOT NULL,
  "levelNumber" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requiredDistance" INTEGER NOT NULL,
  "speedMultiplier" DOUBLE PRECISION NOT NULL,
  "rewardCoins" INTEGER NOT NULL,
  "environmentType" TEXT NOT NULL,
  "unlockRequirement" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "currentLevel" INTEGER NOT NULL DEFAULT 1,
  "completedLevel" INTEGER NOT NULL DEFAULT 0,
  "totalStars" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Level_levelNumber_key" ON "Level"("levelNumber");
CREATE INDEX "Level_levelNumber_idx" ON "Level"("levelNumber");
CREATE UNIQUE INDEX "UserProgress_userId_key" ON "UserProgress"("userId");

ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
