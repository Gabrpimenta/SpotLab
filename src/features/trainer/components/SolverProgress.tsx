import { useEffect } from "react";
import { Check } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import {
  solverProgressLabel,
  type SolverProgressEvent,
} from "@/src/services/solver/solver.types";

const stageOrder: readonly SolverProgressEvent["type"][] = [
  "started",
  "range-analysis",
  "ev-calculation",
  "strategy-comparison",
  "coach-generation",
  "completed",
];

export function SolverProgress({
  stage,
}: {
  readonly stage: SolverProgressEvent["type"];
}) {
  const progress = useSharedValue(0);
  const index = stageOrder.indexOf(stage);
  useEffect(() => {
    progress.value = withTiming(((index + 1) / stageOrder.length) * 100, {
      duration: 360,
    });
  }, [index, progress]);
  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(160)}
      style={styles.container}
      accessibilityRole="progressbar"
    >
      <View style={styles.topRow}>
        <View style={styles.live}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>CALCULATING BATTLE SCORE</Text>
        </View>
        <Text style={styles.percent}>
          {Math.round(((index + 1) / stageOrder.length) * 100)}%
        </Text>
      </View>
      <View style={styles.stages}>
        {stageOrder.slice(1, 5).map((item, stageIndex) => {
          const resolved = index > stageIndex + 1;
          const active = index === stageIndex + 1;
          return (
            <View key={item} style={styles.stageRow}>
              <View
                style={[
                  styles.stageDot,
                  resolved && styles.stageResolved,
                  active && styles.stageActive,
                ]}
              >
                {resolved ? (
                  <Check color="#3B2100" size={14} strokeWidth={3.4} />
                ) : active ? (
                  <View style={styles.stageActiveDot} />
                ) : null}
              </View>
              <Text
                style={[
                  styles.stageText,
                  (active || resolved) && styles.stageTextActive,
                ]}
              >
                {solverProgressLabel[item]}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
      <Text style={styles.note}>
        PRACTICE ENGINE · ILLUSTRATIVE STRATEGY DATA
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  live: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.hotRed },
  liveText: {
    color: colors.hotRed,
    ...typography.secondary,
    fontWeight: "900",
  },
  percent: {
    color: colors.textSecondary,
    ...typography.caption,
    fontVariant: ["tabular-nums"],
  },
  stages: { gap: 7 },
  stageRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stageDot: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  stageResolved: {
    backgroundColor: "#FFD15C",
    borderColor: "#FFE49A",
  },
  stageActive: {
    borderColor: colors.hotRed,
    borderWidth: 2,
    backgroundColor: "rgba(255,33,77,0.09)",
  },
  stageActiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.hotRed,
  },
  stageText: { color: colors.textMuted, ...typography.caption },
  stageTextActive: { color: colors.textPrimary },
  track: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: colors.hotRed,
    borderRadius: radius.pill,
  },
  note: { color: colors.textMuted, ...typography.caption },
});
