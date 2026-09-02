import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";

const palettes = {
  hero: ["#FFC94D", "#D54433"] as const,
  atlas: ["#35E7FF", "#3F2A9A"] as const,
  nova: ["#FF3CAB", "#7222B3"] as const,
  river: ["#43F3B0", "#1875B3"] as const,
} as const;

export function PlayerAvatar({
  name,
  variant = "atlas",
  size = 34,
}: {
  readonly name: string;
  readonly variant?: keyof typeof palettes;
  readonly size?: number;
}) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <LinearGradient
      colors={palettes[variant]}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityLabel={`${name} avatar`}
    >
      <View style={styles.cut} />
      <Text
        style={[
          styles.initial,
          { fontSize: Math.max(10, size * 0.34) },
          variant === "hero" && styles.heroInitial,
        ]}
      >
        {initial}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.40)",
    shadowColor: colors.cyan,
    shadowOpacity: 0.48,
    shadowRadius: 7,
  },
  cut: {
    position: "absolute",
    width: "72%",
    height: "42%",
    top: -6,
    right: -5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.13)",
    transform: [{ rotate: "-18deg" }],
  },
  initial: { color: colors.textPrimary, fontWeight: "800" },
  heroInitial: { color: colors.accentInk },
});
