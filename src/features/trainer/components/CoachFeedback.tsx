import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BrainCircuit, Flame, Target, Trophy } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import { RewardBundle } from "@/src/components/game/FigmaArt";
import { ToneCard } from "@/src/components/ToneCard";
import { colors } from "@/src/design-system/colors";
import { gradients } from "@/src/design-system/gradients";
import { radius } from "@/src/design-system/radius";
import { shadows } from "@/src/design-system/shadows";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { FrequencyBar } from "@/src/features/trainer/components/FrequencyBar";
import { RangeModal } from "@/src/features/trainer/components/RangeModal";
import { RatingStars } from "@/src/features/trainer/components/RatingStars";
import type {
  DecisionAction,
  DecisionQuality,
  SolverSolution,
} from "@/src/types/poker";
import { qualityLabel } from "@/src/utils/decision";

interface CoachFeedbackProps {
  readonly solution: SolverSolution;
  readonly selectedAction: DecisionAction;
  readonly selectedAmountBb?: number;
  readonly quality: DecisionQuality;
  readonly evLoss: number;
}

const qualityCue: Record<DecisionQuality, string> = {
  excellent: "Your decision matched the highest-EV line.",
  good: "A strong decision with only a small EV difference.",
  inaccuracy: "A close spot. The strategy mix explains the tradeoff.",
  mistake: "This is a useful pattern to review before the next spot.",
};

const scoreByQuality: Record<DecisionQuality, number> = {
  excellent: 100,
  good: 86,
  inaccuracy: 68,
  mistake: 42,
};

export function CoachFeedback({
  solution,
  selectedAction,
  selectedAmountBb,
  quality,
  evLoss,
}: CoachFeedbackProps) {
  const [rangeVisible, setRangeVisible] = useState(false);
  const [reasonVisible, setReasonVisible] = useState(false);
  const positive = evLoss <= 0.05;
  const ratingGain = { excellent: 24, good: 14, inaccuracy: 5, mistake: 0 }[
    quality
  ];
  const won = quality === "excellent" || quality === "good";

  return (
    <Animated.View entering={FadeIn.duration(180)} style={styles.card}>
      <LinearGradient
        colors={won ? gradients.fireDark : gradients.purpleAnalysis}
        style={styles.resultHero}
      >
        <View style={styles.resultGlow} />
        <View style={styles.resultKicker}>
          {won ? (
            <Trophy color={colors.gold} size={15} />
          ) : (
            <Target color={colors.violet} size={15} />
          )}
          <Text style={styles.resultKickerText}>
            {won ? "Decision complete" : "Review this decision"}
          </Text>
        </View>

        <View style={styles.scoreHero}>
          <Animated.View
            entering={ZoomIn.delay(120).springify()}
            style={styles.scoreCoin}
          >
            <LinearGradient
              colors={gradients.gold}
              style={styles.scoreCoinInner}
            >
              <Flame
                color="#5A2100"
                fill="#5A2100"
                size={15}
                strokeWidth={2.6}
              />
              <Text style={styles.scoreNumber}>{scoreByQuality[quality]}</Text>
              <Text style={styles.scoreUnit}>SCORE</Text>
            </LinearGradient>
          </Animated.View>
          <View style={styles.resultCopy}>
            <Text style={styles.resultTitle}>{qualityLabel[quality]}</Text>
            <RatingStars evLoss={evLoss} />
            <View style={styles.rewardLine}>
              <RewardBundle kind="chips" size={32} />
              <Text style={styles.ratingGain}>+{ratingGain} rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.evBadge}>
          <Text style={styles.evLabel}>EV IMPACT</Text>
          <Text style={[styles.ev, !positive && styles.lossText]}>
            {positive ? "+0.00" : `−${evLoss.toFixed(2)}`} BB
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.cue}>
        <View style={[styles.cueDot, !positive && styles.cueDotWarm]} />
        <Text style={styles.cueText}>{qualityCue[quality]}</Text>
      </View>

      <ToneCard
        accentSide="right"
        contentStyle={styles.comparison}
        tone={positive ? "success" : "warning"}
      >
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Your action</Text>
          <Text style={styles.comparisonValue}>
            {selectedAction.toUpperCase()}
            {selectedAmountBb ? ` · ${selectedAmountBb} BB` : ""}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Best line</Text>
          <Text style={[styles.comparisonValue, styles.best]}>
            {solution.bestAction.toUpperCase()}
          </Text>
        </View>
      </ToneCard>

      <ToneCard
        accentSide="left"
        contentStyle={styles.strategyCard}
        tone="info"
      >
        <View style={styles.sectionHeading}>
          <BrainCircuit color={colors.cyan} size={17} />
          <View>
            <Text style={styles.sectionLabel}>Range strategy</Text>
            <Text style={styles.sectionMeta}>
              How the full range plays this spot
            </Text>
          </View>
        </View>
        <View style={styles.frequencies}>
          {solution.frequencies.map((frequency, index) => (
            <FrequencyBar
              key={frequency.action}
              item={frequency}
              delay={index * 80}
            />
          ))}
        </View>
      </ToneCard>

      <ToneCard
        accentSide="left"
        contentStyle={styles.coachCard}
        tone="insight"
      >
        <View style={styles.coachBody}>
          <View style={styles.coachCopy}>
            <View style={styles.coachHeader}>
              <View style={styles.analysisMark}>
                <BrainCircuit color={colors.cyan} size={19} strokeWidth={1.8} />
              </View>
              <View style={styles.coachTitleBlock}>
                <Text style={styles.coachName}>Solver insight</Text>
                <Text style={styles.coachRole}>Range analysis</Text>
              </View>
            </View>
            <Text style={styles.coachLead}>
              {positive
                ? "You applied pressure in the right place while protecting your range."
                : "The stronger line protects more of your range while still applying pressure."}
            </Text>
            {reasonVisible ? (
              <Animated.Text
                entering={FadeInDown.duration(220)}
                style={styles.explanation}
              >
                {solution.explanation}
              </Animated.Text>
            ) : null}
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: reasonVisible }}
          onPress={() => setReasonVisible((value) => !value)}
          style={({ pressed }) => [styles.askWhy, pressed && styles.pressed]}
        >
          <Text style={styles.askWhyText}>
            {reasonVisible ? "Hide explanation" : "Why this works"}
          </Text>
          <Text style={styles.askWhyArrow}>{reasonVisible ? "↑" : "↓"}</Text>
        </Pressable>
      </ToneCard>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open range lab, explore all 169 starting hands"
        onPress={() => setRangeVisible(true)}
        style={({ pressed }) => [styles.rangeAction, pressed && styles.pressed]}
      >
        <View style={styles.rangeActionIcon}>
          <Target color={colors.cyan} size={18} />
        </View>
        <View style={styles.rangeActionCopy}>
          <Text style={styles.rangeActionTitle}>Open range lab</Text>
          <Text style={styles.rangeActionMeta}>
            Explore all 169 starting hands
          </Text>
        </View>
        <Text style={styles.rangeActionArrow}>›</Text>
      </Pressable>
      <RangeModal
        visible={rangeVisible}
        onClose={() => setRangeVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  resultHero: {
    minHeight: 220,
    borderRadius: radius.xxl,
    padding: spacing.md,
    overflow: "hidden",
  },
  resultGlow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,33,77,0.18)",
    right: -110,
    top: -140,
  },
  resultKicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resultKickerText: {
    color: colors.gold,
    ...typography.label,
    fontWeight: "700",
  },
  scoreHero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  scoreCoin: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 5,
    backgroundColor: "#713002",
    ...shadows.gold,
  },
  scoreCoinInner: {
    flex: 1,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.72)",
  },
  scoreNumber: {
    color: "#4E1C00",
    fontSize: 38,
    lineHeight: 41,
    fontWeight: "900",
    letterSpacing: -1.8,
    fontVariant: ["tabular-nums"],
  },
  scoreUnit: {
    color: "#5A2100",
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "900",
    letterSpacing: 1.15,
  },
  resultCopy: { gap: spacing.xs, maxWidth: 155 },
  resultTitle: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 28,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  rewardLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginLeft: -7,
  },
  ratingGain: { color: colors.gold, ...typography.caption, fontWeight: "700" },
  evBadge: {
    marginTop: spacing.md,
    alignSelf: "center",
    minWidth: 150,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,4,20,0.56)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  evLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: "700",
  },
  ev: {
    color: colors.green,
    ...typography.bodyStrong,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  lossText: { color: colors.warning },
  cue: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  cueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  cueDotWarm: { backgroundColor: colors.warning },
  cueText: { flex: 1, color: colors.textSecondary, ...typography.caption },
  comparison: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  comparisonItem: { flex: 1 },
  comparisonLabel: {
    color: colors.textMuted,
    ...typography.caption,
    fontWeight: "600",
  },
  comparisonValue: {
    color: colors.white,
    ...typography.bodyStrong,
    fontWeight: "800",
    marginTop: 3,
  },
  best: { color: colors.gold },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.white,
    ...typography.secondary,
    fontWeight: "700",
  },
  sectionMeta: { color: colors.textMuted, ...typography.caption },
  strategyCard: { gap: spacing.md },
  frequencies: { gap: spacing.sm },
  coachCard: {
    minHeight: 0,
    gap: spacing.sm,
  },
  coachBody: { gap: spacing.sm },
  coachCopy: { flex: 1, minWidth: 0, gap: spacing.sm },
  coachHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  analysisMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(53,231,255,0.08)",
  },
  coachTitleBlock: { gap: 1 },
  coachName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  coachRole: {
    color: colors.cyan,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  coachLead: {
    color: colors.white,
    ...typography.body,
    lineHeight: 24,
    maxWidth: 420,
  },
  explanation: {
    color: colors.textSecondary,
    ...typography.secondary,
    lineHeight: 21,
  },
  askWhy: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
    paddingTop: spacing.sm,
  },
  askWhyText: {
    color: colors.cyan,
    ...typography.caption,
    fontWeight: "700",
  },
  askWhyArrow: { color: colors.cyan, fontSize: 15 },
  rangeAction: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
    paddingBottom: spacing.md,
  },
  rangeActionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(53,231,255,0.08)",
  },
  rangeActionCopy: { flex: 1, minWidth: 0 },
  rangeActionTitle: {
    color: colors.textPrimary,
    ...typography.bodyStrong,
  },
  rangeActionMeta: {
    color: colors.textMuted,
    ...typography.caption,
    marginTop: 2,
  },
  rangeActionArrow: {
    color: colors.textMuted,
    fontSize: 24,
    lineHeight: 26,
  },
  pressed: { opacity: 0.72 },
});
