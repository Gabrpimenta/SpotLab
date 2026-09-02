import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { typography } from "@/src/design-system/typography";
import type { SolverActionFrequency } from "@/src/types/poker";

const actionColor = {
  fold: colors.red,
  check: colors.violet,
  call: colors.cyan,
  bet: colors.hotRed,
  raise: colors.gold,
} as const;

export function FrequencyBar({
  item,
  delay,
}: {
  readonly item: SolverActionFrequency;
  readonly delay: number;
}) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(item.frequency, { duration: 450 + delay });
  }, [delay, item.frequency, width]);
  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <View style={styles.actionLabel}>
          <View
            style={[
              styles.marker,
              { backgroundColor: actionColor[item.action] },
            ]}
          />
          <Text style={styles.action}>{item.action.toUpperCase()}</Text>
        </View>
        <View style={styles.numbers}>
          <Text style={styles.ev}>+{item.ev.toFixed(2)} EV</Text>
          <Text style={styles.value}>{item.frequency}%</Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: actionColor[item.action] },
            style,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 5 },
  labels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionLabel: { flexDirection: "row", alignItems: "center", gap: 7 },
  marker: { width: 7, height: 7, borderRadius: 3.5 },
  numbers: { flexDirection: "row", alignItems: "center", gap: 10 },
  action: {
    color: colors.textPrimary,
    ...typography.caption,
    fontWeight: "700",
  },
  value: {
    color: colors.textSecondary,
    ...typography.caption,
    fontVariant: ["tabular-nums"],
  },
  ev: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  track: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
