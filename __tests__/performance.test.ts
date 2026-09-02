import {
  calculatePerformance,
  initialProgress,
} from "@/src/services/performance/performance.service";
import type { TrainingResult } from "@/src/types/poker";

describe("performance calculation", () => {
  it("updates hands, score, accuracy, and history after a completed hand", () => {
    const before = calculatePerformance(initialProgress);
    const result: TrainingResult = {
      id: "new-result",
      spotId: "spot-x",
      spotTitle: "BTN vs BB",
      category: "Flop play",
      action: "bet",
      bestAction: "bet",
      evLoss: 0,
      quality: "excellent",
      score: 100,
      completedAt: "2026-09-01T12:00:00.000Z",
    };
    const after = calculatePerformance({
      ...initialProgress,
      results: [result, ...initialProgress.results],
    });

    expect(after.handsTrained).toBe(before.handsTrained + 1);
    expect(after.decisionScore).toBeGreaterThanOrEqual(before.decisionScore);
    expect(after.accuracy).toBeGreaterThanOrEqual(before.accuracy);
    expect(after.recentResults[0]).toEqual(result);
  });
});
