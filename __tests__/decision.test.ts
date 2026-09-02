import { trainingSpots } from "@/src/mocks/spots";
import {
  classifyEvLoss,
  gradeDecision,
  scoreEvLoss,
} from "@/src/utils/decision";

describe("decision grading", () => {
  it("gives the recommended action a perfect grade", () => {
    const spot = trainingSpots[0];
    const grade = gradeDecision(spot.solution, spot.solution.bestAction);

    expect(grade).toMatchObject({
      evLoss: 0,
      quality: "excellent",
      score: 100,
    });
  });

  it("uses centralized decision thresholds", () => {
    expect(classifyEvLoss(0.05)).toBe("excellent");
    expect(classifyEvLoss(0.15)).toBe("good");
    expect(classifyEvLoss(0.35)).toBe("inaccuracy");
    expect(classifyEvLoss(0.36)).toBe("mistake");
    expect(scoreEvLoss(0.8)).toBe(30);
  });
});
