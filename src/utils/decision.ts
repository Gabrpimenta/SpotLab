import type {
  DecisionAction,
  DecisionQuality,
  SolverSolution,
} from "@/src/types/poker";

export const classifyEvLoss = (evLoss: number): DecisionQuality => {
  if (evLoss <= 0.05) return "excellent";
  if (evLoss <= 0.15) return "good";
  if (evLoss <= 0.35) return "inaccuracy";
  return "mistake";
};

export const scoreEvLoss = (evLoss: number): number =>
  Math.max(30, Math.round(100 - Math.min(evLoss, 0.7) * 100));

export const getActionEv = (
  solution: SolverSolution,
  action: DecisionAction,
): number =>
  solution.frequencies.find((frequency) => frequency.action === action)?.ev ??
  0;

export const gradeDecision = (
  solution: SolverSolution,
  action: DecisionAction,
) => {
  const bestEv = Math.max(
    ...solution.frequencies.map((frequency) => frequency.ev),
  );
  const selectedEv = getActionEv(solution, action);
  const evLoss = Number(Math.max(0, bestEv - selectedEv).toFixed(2));

  return {
    evLoss,
    selectedEv,
    quality: classifyEvLoss(evLoss),
    score: scoreEvLoss(evLoss),
  } as const;
};

export const qualityLabel: Record<DecisionQuality, string> = {
  excellent: "Excellent",
  good: "Strong line",
  inaccuracy: "Small EV leak",
  mistake: "Major EV leak",
};
