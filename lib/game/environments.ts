import { EnvironmentType } from "@/types/level";

export const environmentConfigs: Record<EnvironmentType, {
  sky: string;
  fog: string;
  floor: string;
  rail: string;
  wall: string;
  primaryLight: string;
  accentLight: string;
  trainColor: string;
  particleColor: string;
  ambient: number;
  directional: number;
}> = {
  normal_station: {
    sky: "#07101d",
    fog: "#08111e",
    floor: "#1a1c23",
    rail: "#747884",
    wall: "#202331",
    primaryLight: "#35f5ff",
    accentLight: "#ff3ea5",
    trainColor: "#1f5fff",
    particleColor: "#9eefff",
    ambient: 0.38,
    directional: 1.35
  },
  dark_tunnel: {
    sky: "#02040b",
    fog: "#030611",
    floor: "#0d111d",
    rail: "#4b5060",
    wall: "#101522",
    primaryLight: "#2347ff",
    accentLight: "#ffb238",
    trainColor: "#18213a",
    particleColor: "#426dff",
    ambient: 0.2,
    directional: 0.9
  },
  neon_city: {
    sky: "#08051a",
    fog: "#110824",
    floor: "#181529",
    rail: "#7c8cff",
    wall: "#21163a",
    primaryLight: "#ff3ea5",
    accentLight: "#35f5ff",
    trainColor: "#9d22ff",
    particleColor: "#ff72cb",
    ambient: 0.42,
    directional: 1.45
  },
  sky_bridge: {
    sky: "#07182c",
    fog: "#0a2540",
    floor: "#1a2633",
    rail: "#9fb4c7",
    wall: "#102a45",
    primaryLight: "#7bdcff",
    accentLight: "#ffd84f",
    trainColor: "#22b8ff",
    particleColor: "#d7f7ff",
    ambient: 0.52,
    directional: 1.7
  },
  future_city: {
    sky: "#020814",
    fog: "#061125",
    floor: "#111827",
    rail: "#8dff4b",
    wall: "#172033",
    primaryLight: "#8dff4b",
    accentLight: "#35f5ff",
    trainColor: "#00d084",
    particleColor: "#8dff4b",
    ambient: 0.5,
    directional: 1.85
  }
};

export function getEnvironmentConfig(type?: string) {
  return environmentConfigs[(type as EnvironmentType) || "normal_station"] ?? environmentConfigs.normal_station;
}
