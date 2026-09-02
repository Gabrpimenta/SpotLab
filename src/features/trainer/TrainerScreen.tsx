import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Flame, Shield, Swords } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Screen } from "@/src/components/Screen";
import { GameButton } from "@/src/components/game/GameButton";
import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { ActionDeck } from "@/src/features/trainer/components/ActionDeck";
import { ActionTimeline } from "@/src/features/trainer/components/ActionTimeline";
import { CoachFeedback } from "@/src/features/trainer/components/CoachFeedback";
import { PokerTable } from "@/src/features/trainer/components/PokerTable";
import { SolverProgress } from "@/src/features/trainer/components/SolverProgress";
import { useHaptics } from "@/src/features/trainer/hooks/useHaptics";
import { useGameAudio } from "@/src/features/trainer/hooks/useGameAudio";
import { useTrainingSpots } from "@/src/features/trainer/hooks/useTrainingSpots";
import {
  transitionToChoosing,
  useTrainerStore,
} from "@/src/features/trainer/store/trainer.store";
import { useRecordTrainingResult } from "@/src/features/performance/usePerformance";
import { solverClient } from "@/src/services/solver/mock-solver.client";
import type { SolverProgressEvent } from "@/src/services/solver/solver.types";
import type {
  DecisionAction,
  DecisionOption,
  TrainingResult,
} from "@/src/types/poker";
import { gradeDecision } from "@/src/utils/decision";

export function TrainerScreen({
  initialSpotId,
}: {
  readonly initialSpotId: string;
}) {
  const spotsQuery = useTrainingSpots();
  const recordResult = useRecordTrainingResult();
  const haptics = useHaptics();
  const gameAudio = useGameAudio();
  const initialized = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const analysisScrolledForSpot = useRef<string | null>(null);
  const feedbackScrolledForSpot = useRef<string | null>(null);
  const [stage, setStage] = useState<SolverProgressEvent["type"]>("started");
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(
    null,
  );
  const [selectedAmountBb, setSelectedAmountBb] = useState<
    number | undefined
  >();
  const state = useTrainerStore();
  const spots = useMemo(() => spotsQuery.data ?? [], [spotsQuery.data]);
  const spot = spots[state.currentSpotIndex];

  useEffect(() => {
    if (!initialized.current && spots.length) {
      const requestedIndex = spots.findIndex(
        (item) => item.id === initialSpotId,
      );
      state.startAt(requestedIndex >= 0 ? requestedIndex : 0);
      initialized.current = true;
    }
  }, [initialSpotId, spots, state]);

  const solveMutation = useMutation({
    mutationFn: ({
      spotId,
      action,
      simulateError = false,
    }: {
      spotId: string;
      action: DecisionAction;
      simulateError?: boolean;
    }) =>
      solverClient.solve(spotId, action, {
        simulateError,
        onProgress: (event) => {
          setStage(event.type);
          if (event.type === "started") useTrainerStore.getState().analyze();
        },
      }),
    onSuccess: (solution, variables) => {
      const currentSpot = spots.find((item) => item.id === variables.spotId);
      if (!currentSpot) return;
      const grade = gradeDecision(solution, variables.action);
      const result: TrainingResult = {
        id: `result-${currentSpot.id}-${Date.now()}`,
        spotId: currentSpot.id,
        spotTitle: currentSpot.title,
        category: currentSpot.category,
        action: variables.action,
        bestAction: solution.bestAction,
        evLoss: grade.evLoss,
        quality: grade.quality,
        score: grade.score,
        completedAt: new Date().toISOString(),
      };
      useTrainerStore.getState().reveal(solution, grade.score, currentSpot.id);
      recordResult.mutate(result);
      if (grade.quality === "excellent") {
        haptics.success();
        gameAudio.success();
      } else {
        haptics.warning();
        gameAudio.alert();
      }
    },
    onError: () => useTrainerStore.getState().fail(),
  });

  if (!spot) {
    return (
      <Screen scroll={false} contentStyle={styles.center}>
        <Text style={styles.loading}>Preparing training deck…</Text>
      </Screen>
    );
  }

  const submit = (
    action: DecisionAction,
    optionKey: string,
    amountBb?: number,
  ) => {
    if (state.status !== "choosing") return;
    haptics.selection();
    setSelectedOptionKey(optionKey);
    setSelectedAmountBb(amountBb);
    analysisScrolledForSpot.current = null;
    state.select(action);
    solveMutation.mutate({ spotId: spot.id, action });
  };

  const retry = () => {
    if (!state.selectedAction) return;
    analysisScrolledForSpot.current = null;
    state.retry();
    solveMutation.mutate({ spotId: spot.id, action: state.selectedAction });
  };

  const leaveTrainer = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/train");
  };

  const next = () => {
    state.next(spots.length);
    setStage("started");
    setSelectedOptionKey(null);
    setSelectedAmountBb(undefined);
    analysisScrolledForSpot.current = null;
    feedbackScrolledForSpot.current = null;
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(transitionToChoosing, 180);
  };

  const revealAnalysis = (offsetY: number) => {
    if (analysisScrolledForSpot.current === spot.id) return;
    analysisScrolledForSpot.current = spot.id;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, offsetY + spacing.xl),
        animated: true,
      });
    }, 120);
  };

  const revealFeedback = (offsetY: number) => {
    if (feedbackScrolledForSpot.current === spot.id) return;
    feedbackScrolledForSpot.current = spot.id;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, offsetY + spacing.xxxl),
        animated: true,
      });
    }, 140);
  };

  const grade =
    state.solution && state.selectedAction
      ? gradeDecision(state.solution, state.selectedAction)
      : null;
  return (
    <Screen scrollRef={scrollRef} contentStyle={styles.content} underlapTop>
      <View style={styles.nav}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={leaveTrainer}
          hitSlop={12}
          style={styles.back}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.progressBlock}>
          <View style={styles.progressLabelRow}>
            <Swords color={colors.hotRed} size={12} />
            <Text style={styles.progress}>
              Spot {state.currentSpotIndex + 1} of {spots.length}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((state.currentSpotIndex + 1) / spots.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreLabel}>SESSION SCORE</Text>
          <Text style={styles.scoreValue}>
            {state.completedSpotIds.length ? state.sessionScore : "—"}
          </Text>
        </View>
      </View>

      <Animated.View
        key={spot.id}
        entering={FadeIn.duration(260)}
        exiting={FadeOut.duration(120)}
      >
        <View style={styles.heading}>
          <View>
            <View style={styles.eyebrowRow}>
              <Flame color={colors.hotRed} fill={colors.hotRed} size={14} />
              <Text style={styles.eyebrow}>{spot.category}</Text>
            </View>
            <Text style={styles.title}>{spot.title}</Text>
          </View>
          <View style={styles.difficulty}>
            <Shield color={colors.cyan} size={11} />
            <Text style={styles.difficultyText}>{spot.difficulty}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{spot.effectiveStackBb} BB effective</Text>
          <View style={styles.metaDot} />
          <Text style={styles.meta}>{spot.street}</Text>
        </View>

        <PokerTable spot={spot} />

        <View style={styles.timelineWrap}>
          <ActionTimeline history={spot.history} />
        </View>

        <View style={styles.actionWrap}>
          <ActionDeck
            options={spot.options}
            potBb={spot.potBb}
            selectedKey={selectedOptionKey}
            disabled={state.status !== "choosing"}
            onSelect={(decision: DecisionOption, optionKey: string) =>
              submit(decision.action, optionKey, decision.amountBb)
            }
          />
        </View>

        {state.status === "analyzing" || state.status === "submitting" ? (
          <View
            style={styles.analysisWrap}
            onLayout={(event) => revealAnalysis(event.nativeEvent.layout.y)}
          >
            <SolverProgress stage={stage} />
          </View>
        ) : null}

        {state.status === "error" ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              We couldn’t analyze this spot.
            </Text>
            <Text style={styles.errorCopy}>
              Your decision is saved. Try the analysis again.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={retry}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {state.status === "feedback" &&
        state.solution &&
        state.selectedAction &&
        grade ? (
          <View
            style={styles.feedbackWrap}
            onLayout={(event) => revealFeedback(event.nativeEvent.layout.y)}
          >
            <CoachFeedback
              solution={state.solution}
              selectedAction={state.selectedAction}
              selectedAmountBb={selectedAmountBb}
              quality={grade.quality}
              evLoss={grade.evLoss}
            />
            <GameButton
              label="Next scenario"
              detail="Continue this training session"
              tone="danger"
              icon={<Swords color={colors.white} size={22} />}
              onPress={next}
            />
          </View>
        ) : null}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  center: { alignItems: "center", justifyContent: "center" },
  loading: { color: colors.textSecondary, ...typography.body },
  nav: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },
  progressBlock: { flex: 1, paddingHorizontal: spacing.lg, gap: 6 },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  progress: {
    color: colors.white,
    ...typography.caption,
    textAlign: "center",
    letterSpacing: 0.8,
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.hotRed,
    borderRadius: radius.pill,
  },
  score: { width: 62, alignItems: "flex-end" },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scoreValue: {
    color: colors.gold,
    ...typography.bodyStrong,
    fontVariant: ["tabular-nums"],
  },
  heading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eyebrow: {
    color: colors.hotRed,
    ...typography.secondary,
    fontWeight: "900",
  },
  title: {
    color: colors.textPrimary,
    ...typography.display,
    fontSize: 27,
    lineHeight: 32,
    marginTop: 2,
  },
  difficulty: {
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  difficultyText: { color: colors.cyan, ...typography.caption },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  meta: { color: colors.textSecondary, ...typography.secondary },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  timelineWrap: { marginTop: spacing.sm },
  actionWrap: { marginTop: spacing.sm, marginBottom: spacing.sm },
  context: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xxs,
  },
  contextLabel: {
    color: colors.textMuted,
    ...typography.caption,
    letterSpacing: 0.6,
  },
  contextText: { color: colors.textSecondary, ...typography.secondary },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  question: { color: colors.textPrimary, ...typography.title },
  prompt: {
    color: colors.textSecondary,
    ...typography.secondary,
    marginTop: 2,
  },
  street: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  streetText: {
    color: colors.textSecondary,
    ...typography.caption,
    textTransform: "uppercase",
  },
  actions: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.md },
  errorCard: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  errorTitle: { color: colors.textPrimary, ...typography.section },
  errorCopy: { color: colors.textSecondary, ...typography.secondary },
  retry: {
    minHeight: 46,
    marginTop: spacing.xs,
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { color: colors.accentInk, ...typography.bodyStrong },
  feedbackWrap: { gap: spacing.md },
  analysisWrap: { marginTop: spacing.sm },
  repComplete: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  repIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(98,217,156,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  repIconText: { color: colors.accent, fontSize: 16, fontWeight: "800" },
  repCopy: { flex: 1 },
  repLabel: {
    color: colors.textMuted,
    ...typography.caption,
    letterSpacing: 0.6,
  },
  repTitle: {
    color: colors.textPrimary,
    ...typography.secondary,
    fontWeight: "600",
  },
  repScore: {
    color: colors.accent,
    ...typography.section,
    fontVariant: ["tabular-nums"],
  },
});
