export type EnvironmentType = "normal_station" | "dark_tunnel" | "neon_city" | "sky_bridge" | "future_city";

export type LevelDTO = {
  id: string;
  levelNumber: number;
  name: string;
  description: string;
  requiredDistance: number;
  speedMultiplier: number;
  rewardCoins: number;
  environmentType: EnvironmentType;
  unlockRequirement: number;
  locked?: boolean;
  completed?: boolean;
};

export type UserProgressDTO = {
  id: string;
  userId: string;
  currentLevel: number;
  completedLevel: number;
  totalStars: number;
  completionPercentage?: number;
};
