import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Check, Crosshair, Flame, Swords } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/src/components/Screen";
import { ToneCard } from "@/src/components/ToneCard";
import { RewardBundle } from "@/src/components/game/FigmaArt";
import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { usePerformance } from "@/src/features/performance/usePerformance";
import { SpotPreview } from "@/src/features/trainer/components/SpotPreview";
import { trainingSpots } from "@/src/mocks/spots";
import type { PokerStreet } from "@/src/types/poker";

type StreetFilter = "all" | PokerStreet;
type GameFilter = "mtt" | "cash";

const streets: readonly { id: StreetFilter; label: string }[] = [
  { id: "all", label: "All streets" },
  { id: "preflop", label: "Preflop" },
  { id: "flop", label: "Flop" },
  { id: "turn", label: "Turn" },
  { id: "river", label: "River" },
];

const difficultyColor = {
  Foundation: colors.cyan,
  Intermediate: colors.violet,
  Advanced: colors.hotRed,
} as const;

export function TrainCatalogScreen() {
  const [game, setGame] = useState<GameFilter>("mtt");
  const [street, setStreet] = useState<StreetFilter>("all");
  const summary = usePerformance().data;
  const completedIds = useMemo(
    () => new Set(summary?.recentResults.map((result) => result.spotId)),
    [summary?.recentResults],
  );
  const spots = useMemo(
    () =>
      trainingSpots.filter((spot) => {
        const matchesStreet = street === "all" || spot.street === street;
        const matchesGame =
          game === "mtt"
            ? spot.effectiveStackBb <= 50
            : spot.effectiveStackBb >= 40;
        return matchesStreet && matchesGame;
      }),
    [game, street],
  );

  return (
    <Screen contentStyle={styles.content} underlapTop>
      <Animated.View entering={FadeInDown.duration(280)}>
        <View style={styles.kickerRow}>
          <Crosshair color={colors.cyan} size={15} />
          <Text style={styles.eyebrow}>Training library</Text>
        </View>
        <Text style={styles.title}>Training</Text>
        <Text style={styles.subtitle}>
          Choose a focused scenario and practice one decision at a time.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(50).duration(300)}
        style={styles.filterPanel}
      >
        <View style={styles.gameControl} accessibilityRole="tablist">
          {(["mtt", "cash"] as const).map((item) => {
            const active = game === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setGame(item)}
                style={({ pressed }) => [
                  styles.gameOption,
                  active && styles.gameOptionActive,
                  pressed && styles.selectorPressed,
                ]}
              >
                <Text
                  style={[styles.gameText, active && styles.gameTextActive]}
                >
                  {item.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.streetRow}>
          {streets.map((item) => {
            const active = street === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setStreet(item.id)}
                style={({ pressed }) => [
                  styles.streetChip,
                  active && styles.streetChipActive,
                  pressed && styles.selectorPressed,
                ]}
              >
                <Text
                  style={[styles.streetText, active && styles.streetTextActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(70).duration(300)}
        style={styles.bonusStrip}
      >
        <RewardBundle kind="gift" size={58} />
        <View style={styles.bonusCopy}>
          <Text style={styles.bonusKicker}>DAILY MISSION BONUS</Text>
          <Text style={styles.bonusTitle}>Clear 3 scenarios for a reward</Text>
          <View style={styles.bonusTrack}>
            <View style={styles.bonusFill} />
          </View>
        </View>
        <Text style={styles.bonusProgress}>2/3</Text>
      </Animated.View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>{spots.length} missions ready</Text>
        <Text style={styles.resultMeta}>{game.toUpperCase()} · NLHE</Text>
      </View>

      <View style={styles.grid}>
        {spots.map((spot, index) => {
          const completed = completedIds.has(spot.id);
          return (
            <Animated.View
              key={spot.id}
              entering={FadeInDown.delay(
                Math.min(80 + index * 40, 320),
              ).duration(300)}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Train ${spot.title}, ${spot.category}`}
                onPress={() => router.push(`/trainer/${spot.id}`)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressed,
                ]}
              >
                <ToneCard
                  accentSide="right"
                  contentStyle={styles.cardInner}
                  style={styles.card}
                  tone={completed ? "success" : "neutral"}
                >
                  <View style={styles.cardVisual}>
                    <View style={styles.cardStatusRow}>
                      <View style={styles.missionBadge}>
                        {spot.difficulty === "Advanced" ? (
                          <Flame color={colors.hotRed} size={12} />
                        ) : (
                          <Swords color={colors.cyan} size={12} />
                        )}
                        <Text style={styles.missionBadgeText}>
                          Scenario {index + 1}
                        </Text>
                      </View>
                      {completed ? (
                        <View style={styles.completed}>
                          <Check color={colors.green} size={12} />
                          <Text style={styles.completedText}>Completed</Text>
                        </View>
                      ) : null}
                    </View>
                    <SpotPreview spot={spot} height={124} />
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTop}>
                      <View style={styles.cardCopy}>
                        <Text style={styles.cardTitle}>{spot.title}</Text>
                        <Text style={styles.category}>{spot.category}</Text>
                      </View>
                      <View style={styles.rewardBox}>
                        <RewardBundle kind="chips" size={38} />
                        <View>
                          <Text style={styles.rewardLabel}>RATING</Text>
                          <Text style={styles.rewardText}>
                            +{30 + index * 5}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tags}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>
                          {spot.effectiveStackBb} BB
                        </Text>
                      </View>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{spot.street}</Text>
                      </View>
                      <View style={styles.difficultyTag}>
                        <View
                          style={[
                            styles.difficultyDot,
                            {
                              backgroundColor: difficultyColor[spot.difficulty],
                            },
                          ]}
                        />
                        <Text style={styles.tagText}>{spot.difficulty}</Text>
                      </View>
                      <View style={styles.launchPill}>
                        <Text style={styles.launchText}>Train</Text>
                        <Text style={styles.arrow}>›</Text>
                      </View>
                    </View>
                  </View>
                </ToneCard>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eyebrow: { color: colors.cyan, ...typography.label },
  title: {
    color: colors.textPrimary,
    ...typography.display,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
    marginTop: spacing.xs,
  },
  filterPanel: {
    gap: spacing.xs,
  },
  bonusStrip: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
  },
  bonusCopy: { flex: 1, minWidth: 0, gap: 2 },
  bonusKicker: {
    color: colors.gold,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  bonusTitle: { color: colors.white, ...typography.caption, fontWeight: "700" },
  bonusTrack: {
    height: 4,
    marginTop: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSubtle,
    overflow: "hidden",
  },
  bonusFill: {
    width: "67%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  bonusProgress: {
    color: colors.gold,
    ...typography.bodyStrong,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  gameControl: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
    backgroundColor: "rgba(18,15,29,0.76)",
  },
  gameOption: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  gameOptionActive: {
    borderColor: "rgba(53,231,255,0.28)",
    backgroundColor: "rgba(53,231,255,0.10)",
  },
  gameText: { color: colors.textMuted, ...typography.label },
  gameTextActive: { color: colors.cyan, fontWeight: "800" },
  streetRow: { flexDirection: "row", gap: 5 },
  streetChip: {
    flex: 1,
    minWidth: 0,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
    backgroundColor: "rgba(255,255,255,0.025)",
  },
  streetChipActive: {
    borderColor: "rgba(53,231,255,0.34)",
    backgroundColor: "rgba(53,231,255,0.09)",
  },
  streetText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700",
  },
  streetTextActive: { color: colors.cyan, fontWeight: "800" },
  selectorPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultCount: {
    color: colors.textPrimary,
    ...typography.bodyStrong,
    fontWeight: "700",
  },
  resultMeta: { color: colors.textMuted, ...typography.caption },
  grid: { gap: spacing.md },
  cardPressable: { borderRadius: radius.lg },
  card: { borderRadius: radius.lg },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardInner: { padding: 0 },
  cardVisual: { padding: spacing.sm, paddingBottom: 0, gap: spacing.xs },
  cardStatusRow: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  missionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  missionBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },
  completed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  completedText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "700",
  },
  cardInfo: { padding: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  cardCopy: { flex: 1 },
  cardTitle: {
    color: colors.textPrimary,
    ...typography.section,
  },
  category: {
    color: colors.textSecondary,
    ...typography.secondary,
    marginTop: 1,
  },
  rewardBox: { flexDirection: "row", alignItems: "center", gap: 1 },
  rewardLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  rewardText: {
    color: colors.gold,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  launchPill: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  launchText: {
    color: colors.hotRed,
    fontSize: 10,
    fontWeight: "700",
  },
  arrow: { color: colors.hotRed, fontSize: 22 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  tag: {
    paddingRight: 9,
    paddingVertical: 3,
  },
  difficultyTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingRight: 9,
    paddingVertical: 3,
  },
  difficultyDot: { width: 6, height: 6, borderRadius: 3 },
  tagText: {
    color: colors.textSecondary,
    ...typography.caption,
  },
});
