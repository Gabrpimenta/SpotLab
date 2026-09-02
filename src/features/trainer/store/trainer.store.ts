import { create } from "zustand";

import type { DecisionAction, SolverSolution } from "@/src/types/poker";

export type TrainerStatus =
  | "choosing"
  | "submitting"
  | "analyzing"
  | "feedback"
  | "transitioning"
  | "error";

interface TrainerState {
  status: TrainerStatus;
  currentSpotIndex: number;
  selectedAction: DecisionAction | null;
  solution: SolverSolution | null;
  sessionScore: number;
  completedSpotIds: readonly string[];
  startAt: (index: number) => void;
  select: (action: DecisionAction) => void;
  analyze: () => void;
  reveal: (solution: SolverSolution, score: number, spotId: string) => void;
  fail: () => void;
  retry: () => void;
  next: (spotCount: number) => void;
  reset: () => void;
}

const initialState = {
  status: "choosing" as const,
  currentSpotIndex: 0,
  selectedAction: null,
  solution: null,
  sessionScore: 0,
  completedSpotIds: [] as readonly string[],
};

export const useTrainerStore = create<TrainerState>((set, get) => ({
  ...initialState,
  startAt: (index) => set({ ...initialState, currentSpotIndex: index }),
  select: (action) => set({ selectedAction: action, status: "submitting" }),
  analyze: () => set({ status: "analyzing" }),
  reveal: (solution, score, spotId) => {
    const completed = [...get().completedSpotIds, spotId];
    const previousTotal = get().sessionScore * (completed.length - 1);
    set({
      solution,
      status: "feedback",
      completedSpotIds: completed,
      sessionScore: Math.round((previousTotal + score) / completed.length),
    });
  },
  fail: () => set({ status: "error" }),
  retry: () => set({ status: "submitting", solution: null }),
  next: (spotCount) =>
    set({
      status: "transitioning",
      currentSpotIndex: (get().currentSpotIndex + 1) % spotCount,
      selectedAction: null,
      solution: null,
    }),
  reset: () => set(initialState),
}));

export const transitionToChoosing = () =>
  useTrainerStore.setState({ status: "choosing" });
