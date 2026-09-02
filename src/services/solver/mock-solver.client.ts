import { getTrainingSpot } from "@/src/mocks/spots";
import { normalizeSolverSolution } from "@/src/services/solver/solver.normalizer";
import type { DecisionAction, SolverSolution } from "@/src/types/poker";
import type {
  SolveOptions,
  SolverClient,
  SolverProgressEvent,
} from "@/src/services/solver/solver.types";

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

const stages: readonly SolverProgressEvent[] = [
  { type: "started" },
  { type: "range-analysis" },
  { type: "ev-calculation" },
  { type: "strategy-comparison" },
  { type: "coach-generation" },
];

export class MockSolverClient implements SolverClient {
  async solve(
    spotId: string,
    _action: DecisionAction,
    options: SolveOptions = {},
  ): Promise<SolverSolution> {
    const spot = getTrainingSpot(spotId);
    if (!spot) throw new Error(`Unknown training spot: ${spotId}`);

    const delayMs = options.delayMs ?? 520;
    for (const stage of stages) {
      options.onProgress?.(stage);
      await wait(delayMs);
    }

    if (options.simulateError) throw new Error("Simulated solver failure");

    const rawResponse = {
      spot_id: spot.solution.spotId,
      recommendation: spot.solution.bestAction,
      action_mix: spot.solution.frequencies.map((entry) => ({
        action: entry.action,
        pct: entry.frequency,
        expected_value: entry.ev,
      })),
      coach_copy: spot.solution.explanation,
    };

    const solution = normalizeSolverSolution(rawResponse);
    options.onProgress?.({ type: "completed" });
    return solution;
  }
}

export const solverClient: SolverClient = new MockSolverClient();
