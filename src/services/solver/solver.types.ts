import type { DecisionAction, SolverSolution } from "@/src/types/poker";

export type SolverProgressEvent =
  | { readonly type: "started" }
  | { readonly type: "range-analysis" }
  | { readonly type: "ev-calculation" }
  | { readonly type: "strategy-comparison" }
  | { readonly type: "coach-generation" }
  | { readonly type: "completed" };

export interface SolveOptions {
  readonly delayMs?: number;
  readonly simulateError?: boolean;
  readonly onProgress?: (event: SolverProgressEvent) => void;
}

export interface SolverClient {
  solve(
    spotId: string,
    action: DecisionAction,
    options?: SolveOptions,
  ): Promise<SolverSolution>;
}

export const solverProgressLabel: Record<SolverProgressEvent["type"], string> =
  {
    started: "Preparing spot model",
    "range-analysis": "Evaluating ranges",
    "ev-calculation": "Calculating expected value",
    "strategy-comparison": "Comparing mixed strategies",
    "coach-generation": "Building coaching explanation",
    completed: "Solution ready",
  };
