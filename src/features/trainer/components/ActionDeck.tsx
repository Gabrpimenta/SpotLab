import { LinearGradient } from "expo-linear-gradient";
import { CircleDot, TimerReset } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { useGameAudio } from "@/src/features/trainer/hooks/useGameAudio";
import type { DecisionAction, DecisionOption } from "@/src/types/poker";

const actionGradient: Record<
  DecisionAction,
  readonly [string, string, string]
> = {
  fold: ["#3B3441", "#29242F", "#1B1820"],
  check: ["#3C2553", "#291A38", "#1C1426"],
  call: ["#347EAD", "#245C87", "#193E62"],
  bet: ["#FF4B68", "#E71648", "#B20A3A"],
  raise: ["#D6A43A", "#A66D22", "#724516"],
};

const actionAccent: Record<DecisionAction, string> = {
  fold: "#8E8296",
  check: colors.violet,
  call: colors.blue,
  bet: colors.hotRed,
  raise: colors.gold,
};

export function ActionDeck({
  options,
  potBb,
  selectedKey,
  disabled,
  onSelect,
}: {
  readonly options: readonly DecisionOption[];
  readonly potBb: number;
  readonly selectedKey: string | null;
  readonly disabled: boolean;
  readonly onSelect: (option: DecisionOption, key: string) => void;
}) {
  const audio = useGameAudio();

  return (
    <LinearGradient colors={["#241A31", "#16111E"]} style={styles.deck}>
      <View style={styles.header}>
        <View>
          <View style={styles.kickerRow}>
            <CircleDot color={colors.cyan} size={13} />
            <Text style={styles.kicker}>Pot {potBb} BB</Text>
          </View>
          <Text style={styles.title}>Choose your action</Text>
        </View>
        <View style={styles.clockPill}>
          <TimerReset color={colors.green} size={12} />
          <Text style={styles.clockText}>NO TIMER</Text>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option) => {
          const key = `${option.action}-${option.amountBb ?? 0}`;
          const selected = selectedKey === key;
          const percentage =
            option.amountBb && option.action === "bet"
              ? Math.round((option.amountBb / potBb) * 100)
              : undefined;
          const sizing = percentage
            ? `${percentage}% POT`
            : option.action === "call"
              ? "TO CALL"
              : option.action === "raise"
                ? "RAISE TO"
                : option.amountBb
                  ? "TOTAL"
                  : option.action === "check"
                    ? "NO WAGER"
                    : "EXIT HAND";

          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={`${option.label}${option.amountBb ? `, ${option.amountBb} big blinds${percentage ? `, ${percentage} percent pot` : ""}` : ""}`}
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              onPress={() => {
                audio.tap();
                onSelect(option, key);
              }}
              style={({ pressed }) => [
                styles.optionShell,
                {
                  borderColor: `${actionAccent[option.action]}70`,
                  shadowColor: actionAccent[option.action],
                },
                selected && styles.selectedShell,
                disabled && !selected && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <LinearGradient
                colors={actionGradient[option.action]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.option}
              >
                <Text style={styles.action}>{option.label}</Text>
                <Text style={styles.sizing}>{sizing}</Text>
                {option.amountBb ? (
                  <Text style={styles.amount}>{option.amountBb} BB</Text>
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  deck: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(67,243,176,0.08)",
  },
  clockText: {
    color: colors.green,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  kicker: { color: colors.cyan, ...typography.caption, fontWeight: "700" },
  title: {
    color: colors.white,
    ...typography.section,
    fontWeight: "800",
    marginTop: 2,
  },
  options: { flexDirection: "row", gap: 7 },
  optionShell: {
    flex: 1,
    minHeight: 80,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.canvasElevated,
    shadowOpacity: 0.14,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingHorizontal: 4,
    paddingVertical: spacing.xs,
  },
  selectedShell: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  disabled: { opacity: 0.36 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  action: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  sizing: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 8,
    fontWeight: "700",
    marginTop: 5,
    letterSpacing: 0.7,
  },
  amount: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
});
