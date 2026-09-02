import type { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors } from "@/src/design-system/colors";
import { gradients } from "@/src/design-system/gradients";
import { motion } from "@/src/design-system/motion";
import { radius } from "@/src/design-system/radius";
import { shadows } from "@/src/design-system/shadows";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GameButtonTone = "danger" | "violet" | "gold" | "cyan";

const toneGradients = {
  danger: gradients.danger,
  violet: gradients.arena,
  gold: gradients.gold,
  cyan: gradients.cyan,
} as const;

export function GameButton({
  label,
  detail,
  icon,
  tone = "danger",
  compact = false,
  disabled = false,
  onPress,
}: {
  readonly label: string;
  readonly detail?: string;
  readonly icon?: ReactNode;
  readonly tone?: GameButtonTone;
  readonly compact?: boolean;
  readonly disabled?: boolean;
  readonly onPress: () => void;
}) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - pressed.value * 0.035 },
      { translateY: pressed.value * 2 },
    ],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${label}${detail ? `, ${detail}` : ""}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, motion.spring);
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, motion.spring);
      }}
      style={[animatedStyle, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={toneGradients[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          compact && styles.compact,
          tone === "danger" && shadows.fire,
          tone === "gold" && shadows.gold,
          tone === "cyan" && shadows.cyan,
          tone === "violet" && shadows.glow,
        ]}
      >
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <View style={styles.copy}>
          <Text
            style={[
              styles.label,
              tone === "gold" && styles.darkLabel,
              compact && styles.compactLabel,
            ]}
          >
            {label}
          </Text>
          {detail ? (
            <Text style={[styles.detail, tone === "gold" && styles.darkDetail]}>
              {detail}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.arrow, tone === "gold" && styles.darkLabel]}>
          ›
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    overflow: "hidden",
  },
  compact: { minHeight: 50, paddingHorizontal: spacing.md },
  disabled: { opacity: 0.38 },
  icon: { width: 28, alignItems: "center" },
  copy: { flex: 1 },
  label: {
    color: colors.white,
    ...typography.bodyStrong,
    fontWeight: "800",
  },
  compactLabel: { fontSize: 14 },
  detail: { color: "rgba(255,255,255,0.76)", ...typography.caption },
  darkLabel: { color: "#4B2303" },
  darkDetail: { color: "rgba(75,35,3,0.70)" },
  arrow: { color: colors.white, fontSize: 32, fontWeight: "400" },
});
