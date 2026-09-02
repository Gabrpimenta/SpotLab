import { z } from "zod";

import type { SolverSolution } from "@/src/types/poker";

const actionSchema = z.enum(["fold", "check", "call", "bet", "raise"]);

export const rawSolverResponseSchema = z.object({
  spot_id: z.string().min(1),
  recommendation: actionSchema,
  action_mix: z
    .array(
      z.object({
        action: actionSchema,
        pct: z.number().min(0).max(100),
        expected_value: z.number(),
      }),
    )
    .min(1),
  coach_copy: z.string().min(1),
});

export const normalizeSolverSolution = (input: unknown): SolverSolution => {
  const parsed = rawSolverResponseSchema.parse(input);
  const total = parsed.action_mix.reduce((sum, action) => sum + action.pct, 0);

  if (Math.abs(total - 100) > 0.01) {
    throw new Error("Solver action frequencies must total 100%");
  }

  return {
    spotId: parsed.spot_id,
    bestAction: parsed.recommendation,
    frequencies: parsed.action_mix.map((entry) => ({
      action: entry.action,
      frequency: entry.pct,
      ev: entry.expected_value,
    })),
    explanation: parsed.coach_copy,
  };
};
