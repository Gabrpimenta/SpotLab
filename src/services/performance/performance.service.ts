import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/src/design-system/colors";
import type { PerformanceSummary, TrainingResult } from "@/src/types/poker";

const STORAGE_KEY = "@spotlab/progress/v1";

export interface ProgressSnapshot {
  readonly results: readonly TrainingResult[];
  readonly streak: number;
  readonly bestStreak: number;
}

const seededResults: readonly TrainingResult[] = [
  {
    id: "seed-1",
    spotId: "hj-bb-river-value",
    spotTitle: "HJ vs BB",
    category: "River value",
    action: "bet",
    bestAction: "bet",
    evLoss: 0,
    quality: "excellent",
    score: 100,
    completedAt: "2026-08-31T18:30:00.000Z",
  },
  {
    id: "seed-2",
    spotId: "co-btn-preflop-threebet",
    spotTitle: "CO vs BTN",
    category: "Preflop 3-bets",
    action: "raise",
    bestAction: "call",
    evLoss: 0.07,
    quality: "good",
    score: 93,
    completedAt: "2026-08-30T15:20:00.000Z",
  },
  {
    id: "seed-3",
    spotId: "bb-sb-river-bluffcatch",
    spotTitle: "BB vs SB",
    category: "River bluff-catching",
    action: "call",
    bestAction: "fold",
    evLoss: 0.39,
    quality: "mistake",
    score: 61,
    completedAt: "2026-08-29T20:10:00.000Z",
  },
];

export const initialProgress: ProgressSnapshot = {
  results: seededResults,
  streak: 12,
  bestStreak: 19,
};

export const calculatePerformance = (
  progress: ProgressSnapshot,
): PerformanceSummary => {
  const baselineHands = 145;
  const baselineScore = 87;
  const baselineAccurate = 119;
  const resultScore = progress.results.reduce(
    (sum, result) => sum + result.score,
    0,
  );
  const accurate = progress.results.filter(
    (result) => result.quality === "excellent" || result.quality === "good",
  ).length;
  const handsTrained = baselineHands + progress.results.length;
  const decisionScore = Math.round(
    (baselineHands * baselineScore + resultScore) / handsTrained,
  );
  const accuracy = Math.round(
    ((baselineAccurate + accurate) / handsTrained) * 100,
  );
  const trendBase = [79, 80, 81, 81, 84, 85];
  const newHands = Math.max(0, progress.results.length - seededResults.length);
  const recentEvLoss = progress.results.length
    ? progress.results.reduce((sum, result) => sum + result.evLoss, 0) /
      progress.results.length
    : 0.12;

  return {
    spotRating: 1842 + newHands * 12,
    tier: "Diamond III",
    ratingChange: 64 + newHands * 12,
    averageEvLoss: Number(((0.12 + recentEvLoss) / 2).toFixed(2)),
    level: 14,
    xp: Math.min(999, 820 + newHands * 35),
    xpTarget: 1000,
    weeklyRank: Math.max(1, 247 - newHands * 4),
    decisionScore,
    handsTrained,
    accuracy,
    streak: progress.streak,
    bestStreak: progress.bestStreak,
    weeklyChange: decisionScore - 81,
    strongestArea: { label: "BTN vs BB", score: 92 },
    weakestArea: {
      label: "3-bet pots",
      score: Math.min(79, decisionScore - 10),
    },
    trend: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (day, index) => ({
        day,
        score: index < trendBase.length ? trendBase[index] : decisionScore,
      }),
    ),
    skills: [
      { label: "Preflop", score: 92, color: colors.cyan },
      { label: "Single-Raised Pots", score: 88, color: colors.green },
      { label: "3-Bet Pots", score: 77, color: colors.amber },
      { label: "Turn Defense", score: 79, color: colors.blue },
      { label: "River Value", score: 86, color: colors.purple },
      { label: "Bluff Catching", score: 74, color: colors.red },
    ],
    recentResults: progress.results.slice(0, 8),
  };
};

export const getProgress = async (): Promise<ProgressSnapshot> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return initialProgress;

  try {
    const parsed = JSON.parse(stored) as Partial<ProgressSnapshot>;
    if (!Array.isArray(parsed.results)) return initialProgress;
    return {
      results: parsed.results,
      streak:
        typeof parsed.streak === "number"
          ? parsed.streak
          : initialProgress.streak,
      bestStreak:
        typeof parsed.bestStreak === "number"
          ? parsed.bestStreak
          : initialProgress.bestStreak,
    };
  } catch {
    return initialProgress;
  }
};

export const getPerformance = async (): Promise<PerformanceSummary> =>
  calculatePerformance(await getProgress());

export const recordTrainingResult = async (
  result: TrainingResult,
): Promise<PerformanceSummary> => {
  const current = await getProgress();
  const updated: ProgressSnapshot = {
    ...current,
    results: [result, ...current.results].slice(0, 50),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return calculatePerformance(updated);
};

export const resetProgress = async (): Promise<PerformanceSummary> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return calculatePerformance(initialProgress);
};
