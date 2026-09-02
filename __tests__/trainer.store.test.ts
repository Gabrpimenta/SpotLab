import { useTrainerStore } from "@/src/features/trainer/store/trainer.store";
import { trainingSpots } from "@/src/mocks/spots";

describe("trainer state machine", () => {
  beforeEach(() => useTrainerStore.getState().reset());

  it("moves from choosing through feedback and into the next spot", () => {
    const store = useTrainerStore.getState();
    store.select("bet");
    expect(useTrainerStore.getState()).toMatchObject({
      status: "submitting",
      selectedAction: "bet",
    });

    useTrainerStore.getState().analyze();
    expect(useTrainerStore.getState().status).toBe("analyzing");

    useTrainerStore
      .getState()
      .reveal(trainingSpots[0].solution, 100, trainingSpots[0].id);
    expect(useTrainerStore.getState()).toMatchObject({
      status: "feedback",
      sessionScore: 100,
      completedSpotIds: [trainingSpots[0].id],
    });

    useTrainerStore.getState().next(trainingSpots.length);
    expect(useTrainerStore.getState()).toMatchObject({
      status: "transitioning",
      currentSpotIndex: 1,
      selectedAction: null,
    });
  });
});
