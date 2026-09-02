export type PokerSuit = "spades" | "hearts" | "diamonds" | "clubs";
export type PokerRank =
  "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A";

export interface PlayingCard {
  readonly rank: PokerRank;
  readonly suit: PokerSuit;
}

export type PlayerPosition =
  "UTG" | "UTG+1" | "HJ" | "CO" | "BTN" | "SB" | "BB";
export type PokerStreet = "preflop" | "flop" | "turn" | "river";
export type DecisionAction = "fold" | "check" | "call" | "bet" | "raise";
export type SpotDifficulty = "Foundation" | "Intermediate" | "Advanced";
export type DecisionQuality = "excellent" | "good" | "inaccuracy" | "mistake";

export interface PlayerState {
  readonly position: PlayerPosition;
  readonly stackBb: number;
  readonly label: string;
}

export interface SpotAction {
  readonly actor: PlayerPosition;
  readonly action: DecisionAction;
  readonly amountBb?: number;
}

export interface DecisionOption {
  readonly action: DecisionAction;
  readonly label: string;
  readonly amountBb?: number;
}

export interface SolverActionFrequency {
  readonly action: DecisionAction;
  readonly frequency: number;
  readonly ev: number;
}

export interface SolverSolution {
  readonly spotId: string;
  readonly bestAction: DecisionAction;
  readonly frequencies: readonly SolverActionFrequency[];
  readonly explanation: string;
}

export interface TrainingSpot {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly difficulty: SpotDifficulty;
  readonly street: PokerStreet;
  readonly potBb: number;
  readonly effectiveStackBb: number;
  readonly hero: PlayerState;
  readonly villain: PlayerState;
  readonly heroCards: readonly [PlayingCard, PlayingCard];
  readonly board: readonly PlayingCard[];
  readonly history: readonly SpotAction[];
  readonly options: readonly DecisionOption[];
  readonly solution: SolverSolution;
}

export interface TrainingResult {
  readonly id: string;
  readonly spotId: string;
  readonly spotTitle: string;
  readonly category: string;
  readonly action: DecisionAction;
  readonly bestAction: DecisionAction;
  readonly evLoss: number;
  readonly quality: DecisionQuality;
  readonly score: number;
  readonly completedAt: string;
}

export interface PerformanceSummary {
  readonly spotRating: number;
  readonly tier: string;
  readonly ratingChange: number;
  readonly averageEvLoss: number;
  readonly level: number;
  readonly xp: number;
  readonly xpTarget: number;
  readonly weeklyRank: number;
  readonly decisionScore: number;
  readonly handsTrained: number;
  readonly accuracy: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly weeklyChange: number;
  readonly strongestArea: { readonly label: string; readonly score: number };
  readonly weakestArea: { readonly label: string; readonly score: number };
  readonly trend: readonly { readonly day: string; readonly score: number }[];
  readonly skills: readonly {
    readonly label: string;
    readonly score: number;
    readonly color: string;
  }[];
  readonly recentResults: readonly TrainingResult[];
}
