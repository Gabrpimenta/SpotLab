import { trainingSpots } from "@/src/mocks/spots";

const boardSizeByStreet = {
  preflop: 0,
  flop: 3,
  turn: 4,
  river: 5,
} as const;

describe("training spot poker plausibility", () => {
  it.each(trainingSpots)("keeps $id internally consistent", (spot) => {
    const visibleCards = [...spot.heroCards, ...spot.board];
    const cardKeys = visibleCards.map((card) => `${card.rank}-${card.suit}`);
    const offeredActions = spot.options.map((option) => option.action);
    const strategyTotal = spot.solution.frequencies.reduce(
      (total, item) => total + item.frequency,
      0,
    );

    expect(new Set(cardKeys).size).toBe(cardKeys.length);
    expect(spot.board).toHaveLength(boardSizeByStreet[spot.street]);
    expect(spot.hero.position).not.toBe(spot.villain.position);
    expect(offeredActions).toContain(spot.solution.bestAction);
    expect(strategyTotal).toBe(100);
    expect(spot.solution.frequencies.every((item) => item.frequency >= 0)).toBe(
      true,
    );
    expect(
      spot.options.every(
        (option) => option.amountBb === undefined || option.amountBb > 0,
      ),
    ).toBe(true);
  });
});
