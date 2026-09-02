import { Platform } from "react-native";

const nativeShadow = (color: string, opacity: number, radius: number, y = 8) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: y },
    },
    android: { elevation: Math.max(2, Math.round(radius / 4)) },
    default: { boxShadow: `0 ${y}px ${radius * 2}px ${color}` },
  });

export const shadows = {
  card: nativeShadow("#000000", 0.24, 12),
  glow: nativeShadow("#8B42FF", 0.24, 14, 0),
  fire: nativeShadow("#FF214D", 0.28, 15, 0),
  gold: nativeShadow("#FFC94D", 0.22, 13, 0),
  cyan: nativeShadow("#35E7FF", 0.22, 12, 0),
} as const;
