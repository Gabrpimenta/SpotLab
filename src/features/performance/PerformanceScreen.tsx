import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Crown,
  Flame,
  Shield,
  Swords,
  Target,
  Trophy,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors } from "@/src/design-system/colors";
import { gradients } from "@/src/design-system/gradients";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { GameButton } from "@/src/components/game/GameButton";
import { gameArt } from "@/src/design-system/art";
import { usePerformance } from "@/src/features/performance/usePerformance";
import { PlayingCard } from "@/src/features/trainer/components/PlayingCard";
import { RatingStars } from "@/src/features/trainer/components/RatingStars";
import { getTrainingSpot, trainingSpots } from "@/src/mocks/spots";
import type { TrainingResult } from "@/src/types/poker";

function Metric({
  label,
  value,
  unit,
  tone = colors.textPrimary,
}: {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly tone?: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: tone }]}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function RankMedallion({ tier }: { readonly tier: string }) {
  return (
    <View style={styles.medallion} accessibilityLabel={`${tier} rank`}>
      <View style={[styles.medallionAccent, styles.medallionAccentTop]} />
      <View style={[styles.medallionAccent, styles.medallionAccentRight]} />
      <View style={[styles.medallionAccent, styles.medallionAccentBottom]} />
      <View style={[styles.medallionAccent, styles.medallionAccentLeft]} />
      <LinearGradient
        colors={["#74D8FF", "#20599D", "#0B2348", "#4CAFFF"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.medallionOuter}
      >
        <View style={styles.medallionTrack}>
          <LinearGradient
            colors={["#152F55", "#030915", "#0A1730"]}
            style={styles.medallionFace}
          >
            <View style={styles.medallionShine} />
            <Crown color={colors.gold} strokeWidth={2.4} size={22} />
            <Text style={styles.shieldTier}>{tier}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

function SkillBar({
  label,
  score,
  color,
}: {
  readonly label: string;
  readonly score: number;
  readonly color: string;
}) {
  return (
    <View style={styles.skill}>
      <View style={styles.skillLabels}>
        <Text style={styles.skillLabel}>{label}</Text>
        <Text style={styles.skillScore}>{score}</Text>
      </View>
      <View style={styles.skillTrack}>
        <View
          style={[
            styles.skillFill,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

function HandResult({ result }: { readonly result: TrainingResult }) {
  const spot = getTrainingSpot(result.spotId);
  const positive = result.evLoss <= 0.05;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Review ${result.spotTitle}, ${result.quality}`}
      onPress={() => router.push(`/trainer/${result.spotId}`)}
      style={({ pressed }) => [styles.handRow, pressed && styles.handPressed]}
    >
      <View style={styles.holeCards}>
        {spot?.heroCards.map((card, index) => (
          <View
            key={`${card.rank}-${card.suit}`}
            style={index === 1 && styles.cardOverlap}
          >
            <PlayingCard card={card} size="mini" dark />
          </View>
        ))}
      </View>
      <View style={styles.handCopy}>
        <Text style={styles.handTitle}>{result.spotTitle}</Text>
        <Text style={styles.handMeta}>
          {spot?.street ?? "Spot"} · {result.action.toUpperCase()}
          {spot?.options.find((item) => item.action === result.action)?.amountBb
            ? ` ${spot.options.find((item) => item.action === result.action)?.amountBb} BB`
            : ""}
        </Text>
        <RatingStars evLoss={result.evLoss} />
      </View>
      <View style={styles.handRight}>
        <Text style={[styles.ev, !positive && styles.evLoss]}>
          {positive ? "0.00" : `−${result.evLoss.toFixed(2)}`}
        </Text>
        <Text style={styles.evLabel}>EV LOSS</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

export function PerformanceScreen() {
  const summary = usePerformance().data;
  if (!summary) {
    return (
      <Screen scroll={false} contentStyle={styles.loading}>
        <Text style={styles.loadingText}>Loading your skill profile…</Text>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content} underlapTop>
      <Animated.View entering={FadeInDown.duration(280)}>
        <View style={styles.kickerRow}>
          <Trophy color={colors.gold} size={15} />
          <Text style={styles.eyebrow}>Performance</Text>
        </View>
        <Text style={styles.title}>Your progress</Text>
        <Text style={styles.subtitle}>
          Review your rating, decision quality, and the areas worth training
          next.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).duration(320)}>
        <LinearGradient
          colors={["#42207A", "#24103F", "#13081F"]}
          style={styles.ratingCard}
        >
          <Image
            source={gameArt.sparkleField}
            contentFit="cover"
            accessible={false}
            style={styles.ratingSparkles}
          />
          <View style={styles.ratingMain}>
            <View style={styles.ratingCopy}>
              <View style={styles.ratingKicker}>
                <Flame color={colors.hotRed} fill={colors.hotRed} size={13} />
                <Text style={styles.ratingLabel}>Spot rating</Text>
              </View>
              <Text style={styles.rating}>
                {summary.spotRating.toLocaleString("en-US")}
              </Text>
              <Text style={styles.tier}>{summary.tier}</Text>
              <Text style={styles.ratingChange}>
                +{summary.ratingChange} over the last 7 days
              </Text>
            </View>
            <View style={styles.trophyPanel}>
              <View style={styles.shieldWrap}>
                <RankMedallion tier="D3" />
              </View>
              <Text style={styles.rankLabel}>Weekly rank</Text>
              <Text style={styles.rank}>#{summary.weeklyRank}</Text>
            </View>
          </View>
          <View style={styles.promotion}>
            <View style={styles.promotionLabels}>
              <Text style={styles.promotionLabel}>Progress to Master</Text>
              <Text style={styles.promotionValue}>26 rating to go</Text>
            </View>
            <View style={styles.promotionTrack}>
              <View style={styles.promotionFill} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(70).duration(320)}
        style={styles.recordStrip}
      >
        <View style={styles.recordItem}>
          <Swords color={colors.hotRed} size={19} />
          <Text style={styles.recordValue}>124</Text>
          <Text style={styles.recordLabel}>WINS</Text>
        </View>
        <View style={styles.recordDivider} />
        <View style={styles.recordItem}>
          <Shield color={colors.cyan} size={19} />
          <Text style={styles.recordValue}>34</Text>
          <Text style={styles.recordLabel}>LOSSES</Text>
        </View>
        <View style={styles.recordDivider} />
        <View style={styles.recordItem}>
          <Crown color={colors.gold} size={19} />
          <Text style={styles.recordValue}>78%</Text>
          <Text style={styles.recordLabel}>WIN RATE</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(90).duration(320)}
        style={styles.metrics}
      >
        <Metric label="Hands trained" value={`${summary.handsTrained}`} />
        <Metric
          label="Avg EV loss"
          value={summary.averageEvLoss.toFixed(2)}
          unit="BB"
          tone={colors.gold}
        />
        <Metric
          label="Accuracy"
          value={`${summary.accuracy}%`}
          tone={colors.green}
        />
        <Metric label="Streak" value={`${summary.streak}`} unit="days" />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(130).duration(320)}
        style={styles.skillPanel}
      >
        <SectionHeader title="Decision skills" action="Last 155 hands" />
        <View style={styles.skills}>
          {summary.skills.map((skill) => (
            <SkillBar key={skill.label} {...skill} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(170).duration(320)}>
        <LinearGradient
          colors={gradients.purpleAnalysis}
          style={styles.leakCard}
        >
          <View style={styles.leakHeader}>
            <View>
              <Text style={styles.leakLabel}>Priority area</Text>
              <Text style={styles.leakTitle}>3-bet pot defense</Text>
            </View>
            <Text style={styles.leakScore}>{summary.weakestArea.score}%</Text>
          </View>
          <View style={styles.leakMetric}>
            <Text style={styles.leakEv}>−0.24 BB</Text>
            <Text style={styles.leakEvLabel}>average EV loss</Text>
          </View>
          <Text style={styles.leakCopy}>
            Your turn-defense decisions are 9 points below your baseline.
          </Text>
          <GameButton
            label="Practice this area"
            detail="Three advanced decisions"
            compact
            tone="violet"
            icon={<Target color={colors.white} size={20} />}
            onPress={() => router.push(`/trainer/${trainingSpots[4].id}`)}
          />
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(210).duration(320)}>
        <SectionHeader
          title="Recent reviews"
          action={`${summary.recentResults.length} reviewed`}
        />
        <View style={styles.hands}>
          {summary.recentResults.length ? (
            summary.recentResults.map((result) => (
              <HandResult key={result.id} result={result} />
            ))
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyCards}>
                <PlayingCard faceDown size="small" />
                <View style={styles.cardOverlap}>
                  <PlayingCard faceDown size="small" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No hands reviewed yet.</Text>
              <Text style={styles.emptyCopy}>
                Play your first spot to build a decision history.
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  loading: { alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.textSecondary, ...typography.body },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eyebrow: { color: colors.gold, ...typography.label },
  title: {
    color: colors.textPrimary,
    ...typography.display,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.secondary,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  ratingCard: {
    minHeight: 244,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: "hidden",
  },
  ratingSparkles: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.08,
  },
  ratingMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  ratingCopy: { flex: 1, minWidth: 0 },
  trophyPanel: {
    width: 122,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldWrap: {
    width: 108,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  medallion: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#39B8FF",
    shadowOpacity: 0.42,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  medallionOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(162,229,255,0.78)",
  },
  medallionTrack: {
    flex: 1,
    padding: 4,
    borderRadius: 40,
    backgroundColor: "#071221",
    borderWidth: 1,
    borderColor: "rgba(2,7,18,0.94)",
  },
  medallionFace: {
    flex: 1,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(116,216,255,0.24)",
    overflow: "hidden",
  },
  medallionShine: {
    position: "absolute",
    top: 5,
    width: 48,
    height: 20,
    borderRadius: 24,
    backgroundColor: "rgba(106,204,255,0.10)",
  },
  medallionAccent: {
    position: "absolute",
    width: 22,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: "#52C5FF",
    borderWidth: 2,
    borderColor: "#173B68",
    zIndex: 2,
  },
  medallionAccentTop: { top: 2 },
  medallionAccentRight: { right: -1, transform: [{ rotate: "90deg" }] },
  medallionAccentBottom: { bottom: 2 },
  medallionAccentLeft: { left: -1, transform: [{ rotate: "90deg" }] },
  shieldTier: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
    textShadowColor: "rgba(81,194,255,0.45)",
    textShadowRadius: 5,
  },
  ratingKicker: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingLabel: {
    color: colors.gold,
    ...typography.caption,
    fontWeight: "700",
  },
  rating: {
    color: colors.textPrimary,
    fontSize: 44,
    lineHeight: 48,
    fontWeight: "800",
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    marginTop: 3,
  },
  tier: {
    color: colors.gold,
    ...typography.bodyStrong,
    fontWeight: "700",
  },
  ratingChange: {
    color: colors.green,
    ...typography.caption,
    marginTop: spacing.xs,
    fontVariant: ["tabular-nums"],
  },
  rankLabel: {
    color: colors.textMuted,
    ...typography.caption,
  },
  rank: {
    color: colors.textPrimary,
    ...typography.section,
    fontVariant: ["tabular-nums"],
  },
  promotion: {
    gap: 6,
  },
  promotionLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promotionLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "700",
  },
  promotionValue: { color: colors.gold, fontSize: 10, fontWeight: "700" },
  promotionTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  promotionFill: {
    width: "78%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  recordStrip: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  recordItem: { flex: 1, alignItems: "center", gap: 2 },
  recordDivider: { width: 1, height: 44, backgroundColor: colors.borderSubtle },
  recordValue: { color: colors.white, fontSize: 20, fontWeight: "900" },
  recordLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  metrics: { flexDirection: "row", flexWrap: "wrap" },
  metric: {
    width: "50%",
    minHeight: 82,
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  metricLabel: { color: colors.textMuted, ...typography.caption },
  metricValueRow: { flexDirection: "row", alignItems: "baseline", gap: 5 },
  metricValue: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  metricUnit: { color: colors.textMuted, ...typography.caption },
  skillPanel: {
    paddingVertical: spacing.xs,
  },
  skills: { gap: spacing.md },
  skill: { gap: 6 },
  skillLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skillLabel: { color: colors.textSecondary, ...typography.secondary },
  skillScore: {
    color: colors.textPrimary,
    ...typography.caption,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  skillTrack: {
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSubtle,
    overflow: "hidden",
  },
  skillFill: { height: "100%", borderRadius: radius.pill },
  leakCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  leakHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leakLabel: { color: colors.hotRed, ...typography.caption, fontWeight: "700" },
  leakTitle: { color: colors.textPrimary, ...typography.title, marginTop: 3 },
  leakScore: {
    color: colors.amber,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  leakMetric: { flexDirection: "row", alignItems: "baseline", gap: spacing.xs },
  leakEv: {
    color: colors.amber,
    ...typography.section,
    fontVariant: ["tabular-nums"],
  },
  leakEvLabel: { color: colors.textMuted, ...typography.caption },
  leakCopy: {
    color: colors.textSecondary,
    ...typography.secondary,
    lineHeight: 20,
  },
  hands: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
  handRow: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  handPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  holeCards: { width: 48, flexDirection: "row", alignItems: "center" },
  cardOverlap: { marginLeft: -10 },
  handCopy: { flex: 1, gap: 2 },
  handTitle: { color: colors.textPrimary, ...typography.bodyStrong },
  handMeta: {
    color: colors.textSecondary,
    ...typography.caption,
    textTransform: "capitalize",
  },
  handRight: { alignItems: "flex-end" },
  ev: {
    color: colors.green,
    ...typography.bodyStrong,
    fontVariant: ["tabular-nums"],
  },
  evLoss: { color: colors.amber },
  evLabel: {
    color: colors.textMuted,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  chevron: { color: colors.textMuted, fontSize: 20, lineHeight: 20 },
  empty: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    padding: spacing.xl,
  },
  emptyCards: { flexDirection: "row", marginBottom: spacing.sm },
  emptyTitle: { color: colors.textPrimary, ...typography.section },
  emptyCopy: {
    color: colors.textSecondary,
    ...typography.secondary,
    textAlign: "center",
  },
});
