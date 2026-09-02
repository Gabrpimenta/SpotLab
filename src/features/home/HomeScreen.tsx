import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  Flame,
  ShieldCheck,
  Swords,
  Target,
  Timer,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameButton } from "@/src/components/game/GameButton";
import { RewardBundle } from "@/src/components/game/FigmaArt";
import { LeagueCrest } from "@/src/components/game/LeagueCrest";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { ToneCard } from "@/src/components/ToneCard";
import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { usePerformance } from "@/src/features/performance/usePerformance";
import { useGameAudio } from "@/src/features/trainer/hooks/useGameAudio";
import { useHaptics } from "@/src/features/trainer/hooks/useHaptics";
import { trainingSpots } from "@/src/mocks/spots";

const spadeTrophyAsset = require("../../../assets/figma-community/spade-trophy.png");
const spotLabMark = require("../../../assets/images/spotlab-app-icon.png");
const dailySpot = trainingSpots[0];

const quickModes = [
  {
    title: "Rapid review",
    detail: "5 decisions · about 4 min",
    reward: "+60 rating",
    color: colors.hotRed,
    icon: Flame,
    spotId: trainingSpots[3].id,
  },
  {
    title: "Rival match",
    detail: "Play 3 hands against Atlas",
    reward: "+90 XP",
    color: colors.cyan,
    icon: Swords,
    spotId: trainingSpots[1].id,
  },
  {
    title: "River test",
    detail: "One high-pressure decision",
    reward: "+1 star",
    color: colors.gold,
    icon: Target,
    spotId: trainingSpots[5].id,
  },
] as const;

export function HomeScreen() {
  const summary = usePerformance().data;
  const audio = useGameAudio();
  const haptics = useHaptics();
  const rating = summary?.spotRating ?? 1842;
  const launch = (spotId: string) => {
    audio.tap();
    haptics.selection();
    router.push(`/trainer/${spotId}`);
  };

  return (
    <Screen contentStyle={styles.content} underlapTop>
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <View style={styles.brandMark}>
            <Image
              source={spotLabMark}
              contentFit="contain"
              accessible={false}
              style={styles.brandMarkImage}
            />
          </View>
          <View style={styles.brandCopy}>
            <Text numberOfLines={1} style={styles.brand}>
              SpotLab
            </Text>
            <Text numberOfLines={1} style={styles.brandMeta}>
              Poker decision training
            </Text>
          </View>
        </View>
        <LeagueCrest
          rating={rating}
          tier={summary?.tier ?? "Diamond III"}
          compact
        />
      </View>

      <Animated.View entering={FadeInDown.duration(280)}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.heroTitle}>Your next decision starts now.</Text>
        <Text style={styles.heroCopy}>
          Read the table, choose your line, and turn sharp decisions into
          rating.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).duration(300)}>
        <ToneCard
          accentSide="left"
          contentStyle={styles.challenge}
          style={styles.challengeShell}
          tone="accent"
        >
          <LinearGradient
            colors={[
              "rgba(98,29,176,0.34)",
              "rgba(44,17,78,0.12)",
              "rgba(24,20,36,0)",
            ]}
            end={{ x: 0.2, y: 1 }}
            pointerEvents="none"
            start={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.challengeHeader}>
            <View style={styles.challengeLabelRow}>
              <View style={styles.statusDot} />
              <View>
                <Text style={styles.challengeLabel}>DAILY CHALLENGE</Text>
                <Text style={styles.challengeLabelMeta}>Featured today</Text>
              </View>
            </View>
            <View style={styles.rewardPill}>
              <Image
                source={spadeTrophyAsset}
                contentFit="contain"
                accessible={false}
                style={styles.rewardTrophy}
              />
              <Text style={styles.rewardText}>+35 rating</Text>
            </View>
          </View>

          <View style={styles.challengeBody}>
            <View style={styles.challengeCopy}>
              <Text style={styles.challengeTitle}>{dailySpot.title}</Text>
              <Text style={styles.challengeCategory}>{dailySpot.category}</Text>
              <View style={styles.metaList}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>
                    {dailySpot.effectiveStackBb} BB
                  </Text>
                  <Text style={styles.metaLabel}>effective</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>{dailySpot.street}</Text>
                  <Text style={styles.metaLabel}>street</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>1</Text>
                  <Text style={styles.metaLabel}>decision</Text>
                </View>
              </View>
              <View style={styles.opponentRow}>
                <View style={styles.opponentAvatar}>
                  <Text style={styles.opponentInitial}>A</Text>
                </View>
                <View style={styles.opponentCopy}>
                  <Text style={styles.opponentName}>Atlas</Text>
                  <Text style={styles.opponentMeta}>Defending from the BB</Text>
                </View>
              </View>
            </View>
            <View style={styles.rewardVisual}>
              <Text style={styles.dropLabel}>DAILY DROP</Text>
              <RewardBundle kind="gift" size={84} />
              <View style={styles.guaranteedPill}>
                <Text style={styles.guaranteedText}>GUARANTEED</Text>
              </View>
            </View>
          </View>

          <View style={styles.challengeFooter}>
            <View style={styles.detailItem}>
              <Timer color={colors.cyan} size={14} />
              <Text style={styles.detailText}>About 2 min</Text>
            </View>
            <View style={styles.detailItem}>
              <ShieldCheck color={colors.green} size={14} />
              <Text style={styles.detailText}>Practice mode</Text>
            </View>
          </View>
          <GameButton
            compact
            label="Start challenge"
            detail="BTN vs BB · one decision"
            tone="danger"
            icon={<Swords color={colors.white} size={20} />}
            onPress={() => launch(dailySpot.id)}
          />
        </ToneCard>
      </Animated.View>

      <View style={styles.section}>
        <SectionHeader title="Quick sessions" action="Choose a mode" />
        <View style={styles.modeList}>
          {quickModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Pressable
                key={mode.title}
                accessibilityRole="button"
                accessibilityLabel={`${mode.title}, ${mode.detail}`}
                onPress={() => launch(mode.spotId)}
                style={({ pressed }) => [
                  styles.modeRow,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.modeIcon,
                    { backgroundColor: `${mode.color}18` },
                  ]}
                >
                  <Icon color={mode.color} size={21} />
                </View>
                <View style={styles.modeCopy}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text numberOfLines={1} style={styles.modeDetail}>
                    {mode.detail}
                  </Text>
                </View>
                <View style={styles.modeRewardWrap}>
                  <Text style={[styles.modeReward, { color: mode.color }]}>
                    {mode.reward}
                  </Text>
                  <ArrowRight color={colors.textMuted} size={16} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.progressStrip}>
        <View style={styles.progressItem}>
          <Flame color={colors.hotRed} fill={colors.hotRed} size={22} />
          <View style={styles.progressCopy}>
            <Text style={styles.progressValue}>
              {summary?.streak ?? 12} days
            </Text>
            <Text style={styles.progressLabel}>Current streak</Text>
          </View>
          <Text style={styles.progressBonus}>1.4× XP</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Image
            source={spadeTrophyAsset}
            contentFit="contain"
            accessible={false}
            style={styles.rankTrophy}
          />
          <View style={styles.progressCopy}>
            <Text style={styles.progressValue}>
              #{summary?.weeklyRank ?? 247}
            </Text>
            <Text style={styles.progressLabel}>Weekly rank</Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start recommended 3-bet pot training"
        onPress={() => launch(trainingSpots[4].id)}
        style={({ pressed }) => [
          styles.focusPressable,
          pressed && styles.pressed,
        ]}
      >
        <ToneCard accentSide="left" contentStyle={styles.focusCard} tone="info">
          <View style={styles.focusIcon}>
            <Target color={colors.cyan} size={21} />
          </View>
          <View style={styles.focusCopy}>
            <Text style={styles.focusLabel}>Recommended focus</Text>
            <Text style={styles.focusTitle}>Improve 3-bet pot defense</Text>
            <Text style={styles.focusMeta}>
              Your largest recent EV leak · −0.24 BB
            </Text>
          </View>
          <View style={styles.focusAction}>
            <ArrowRight color={colors.white} size={19} />
          </View>
        </ToneCard>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
    minWidth: 0,
  },
  brandCopy: { minWidth: 0, flexShrink: 1 },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  brandMarkImage: { width: 36, height: 36 },
  brand: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "800",
  },
  brandMeta: { color: colors.textMuted, ...typography.caption },
  eyebrow: {
    color: colors.cyan,
    ...typography.label,
    marginBottom: spacing.xs,
  },
  heroTitle: { color: colors.white, ...typography.display, maxWidth: 330 },
  heroCopy: {
    color: colors.textSecondary,
    ...typography.secondary,
    marginTop: spacing.xs,
    maxWidth: 340,
  },
  challengeShell: { borderRadius: radius.lg },
  challenge: { padding: spacing.md, gap: spacing.sm },
  challengeHeader: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  challengeLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.hotRed,
  },
  challengeLabel: {
    color: colors.textPrimary,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  challengeLabelMeta: { color: colors.textMuted, fontSize: 9, marginTop: 1 },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,201,77,0.10)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,201,77,0.22)",
  },
  rewardTrophy: { width: 18, height: 14 },
  rewardText: { color: colors.gold, ...typography.caption, fontWeight: "700" },
  challengeBody: {
    minHeight: 142,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  challengeCopy: { flex: 1, minWidth: 0 },
  challengeTitle: { color: colors.white, ...typography.title },
  challengeCategory: {
    color: colors.textSecondary,
    ...typography.caption,
    marginTop: 2,
  },
  metaList: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  metaItem: { flex: 1 },
  metaValue: {
    color: colors.white,
    ...typography.secondary,
    fontWeight: "700",
  },
  metaLabel: { color: colors.textMuted, fontSize: 10, marginTop: 1 },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: 7,
  },
  opponentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  opponentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cyanSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(53,231,255,0.30)",
  },
  opponentInitial: { color: colors.cyan, fontWeight: "800" },
  opponentCopy: { flex: 1, minWidth: 0 },
  opponentName: {
    color: colors.white,
    ...typography.caption,
    fontWeight: "700",
  },
  opponentMeta: { color: colors.textMuted, fontSize: 10 },
  rewardVisual: {
    width: 106,
    height: 124,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dropLabel: {
    color: colors.gold,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: -5,
    zIndex: 2,
  },
  guaranteedPill: {
    marginTop: -7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,4,20,0.72)",
    zIndex: 2,
  },
  guaranteedText: {
    color: colors.textSecondary,
    fontSize: 6.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  challengeFooter: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
  },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { color: colors.textSecondary, ...typography.caption },
  section: { marginTop: spacing.xs },
  modeList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
  modeRow: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  modeIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modeCopy: { flex: 1, minWidth: 0 },
  modeTitle: { color: colors.white, ...typography.bodyStrong },
  modeDetail: { color: colors.textMuted, ...typography.caption, marginTop: 2 },
  modeRewardWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  modeReward: { ...typography.caption, fontWeight: "700" },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  progressStrip: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: spacing.xs,
  },
  progressItem: {
    flex: 1,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  progressDivider: { width: 1, backgroundColor: colors.borderSubtle },
  rankTrophy: { width: 42, height: 34 },
  progressCopy: { flex: 1 },
  progressValue: {
    color: colors.white,
    ...typography.bodyStrong,
    fontWeight: "700",
  },
  progressLabel: { color: colors.textMuted, ...typography.caption },
  progressBonus: {
    color: colors.gold,
    ...typography.secondary,
    fontWeight: "700",
  },
  focusPressable: { borderRadius: radius.lg },
  focusCard: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  focusIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cyanSoft,
  },
  focusCopy: { flex: 1, minWidth: 0 },
  focusLabel: {
    color: colors.cyan,
    ...typography.caption,
    fontWeight: "700",
  },
  focusTitle: { color: colors.white, ...typography.bodyStrong },
  focusMeta: { color: colors.textMuted, ...typography.caption, marginTop: 1 },
  focusAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panelInteractive,
  },
});
