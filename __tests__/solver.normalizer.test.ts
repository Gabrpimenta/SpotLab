import { normalizeSolverSolution } from "@/src/services/solver/solver.normalizer";

const validPayload = {
  spot_id: "spot-1",
  recommendation: "raise",
  action_mix: [
    { action: "raise", pct: 72, expected_value: 1.31 },
    { action: "call", pct: 24, expected_value: 1.12 },
    { action: "fold", pct: 4, expected_value: 0 },
  ],
  coach_copy: "Apply pressure with range advantage.",
};

describe("solver normalization", () => {
  it("maps an external payload into the domain model", () => {
    expect(normalizeSolverSolution(validPayload)).toEqual({
      spotId: "spot-1",
      bestAction: "raise",
      frequencies: [
        { action: "raise", frequency: 72, ev: 1.31 },
        { action: "call", frequency: 24, ev: 1.12 },
        { action: "fold", frequency: 4, ev: 0 },
      ],
      explanation: validPayload.coach_copy,
    });
  });

  it("rejects invalid and incomplete response data", () => {
    expect(() =>
      normalizeSolverSolution({
        ...validPayload,
        action_mix: [{ action: "raise", pct: 75, expected_value: 1 }],
      }),
    ).toThrow("100%");
    expect(() =>
      normalizeSolverSolution({ ...validPayload, recommendation: "shove" }),
    ).toThrow();
  });
});
