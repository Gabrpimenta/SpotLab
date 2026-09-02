import { MockSolverClient } from "@/src/services/solver/mock-solver.client";

describe("mock solver client", () => {
  it("streams deterministic stages and returns normalized data", async () => {
    const client = new MockSolverClient();
    const stages: string[] = [];
    const result = await client.solve("btn-bb-flop-pressure", "bet", {
      delayMs: 0,
      onProgress: (event) => stages.push(event.type),
    });

    expect(stages).toEqual([
      "started",
      "range-analysis",
      "ev-calculation",
      "strategy-comparison",
      "coach-generation",
      "completed",
    ]);
    expect(result.spotId).toBe("btn-bb-flop-pressure");
    expect(
      result.frequencies.reduce((sum, action) => sum + action.frequency, 0),
    ).toBe(100);
  });
});
