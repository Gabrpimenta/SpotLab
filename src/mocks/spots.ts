import type {
  DecisionAction,
  DecisionOption,
  PlayerPosition,
  PlayingCard,
  PokerStreet,
  SolverActionFrequency,
  SpotAction,
  SpotDifficulty,
  TrainingSpot,
} from "@/src/types/poker";

const card = (
  rank: PlayingCard["rank"],
  suit: PlayingCard["suit"],
): PlayingCard => ({ rank, suit });
const option = (action: DecisionAction, amountBb?: number): DecisionOption => ({
  action,
  label: action.toUpperCase(),
  amountBb,
});
const frequency = (
  action: DecisionAction,
  value: number,
  ev: number,
): SolverActionFrequency => ({
  action,
  frequency: value,
  ev,
});

interface SpotSeed {
  id: string;
  title: string;
  category: string;
  difficulty: SpotDifficulty;
  street: PokerStreet;
  positions: readonly [PlayerPosition, PlayerPosition];
  stack: number;
  pot: number;
  heroCards: readonly [PlayingCard, PlayingCard];
  board: readonly PlayingCard[];
  history: readonly SpotAction[];
  options: readonly DecisionOption[];
  bestAction: DecisionAction;
  frequencies: readonly SolverActionFrequency[];
  explanation: string;
}

const makeSpot = (seed: SpotSeed): TrainingSpot => ({
  id: seed.id,
  title: seed.title,
  category: seed.category,
  difficulty: seed.difficulty,
  street: seed.street,
  potBb: seed.pot,
  effectiveStackBb: seed.stack,
  hero: { position: seed.positions[0], stackBb: seed.stack, label: "You" },
  villain: {
    position: seed.positions[1],
    stackBb: seed.stack,
    label: "Opponent",
  },
  heroCards: seed.heroCards,
  board: seed.board,
  history: seed.history,
  options: seed.options,
  solution: {
    spotId: seed.id,
    bestAction: seed.bestAction,
    frequencies: seed.frequencies,
    explanation: seed.explanation,
  },
});

export const trainingSpots: readonly TrainingSpot[] = [
  makeSpot({
    id: "btn-bb-flop-pressure",
    title: "BTN vs BB",
    category: "Single-raised pots",
    difficulty: "Intermediate",
    street: "flop",
    positions: ["BTN", "BB"],
    stack: 30,
    pot: 6.5,
    heroCards: [card("A", "spades"), card("J", "spades")],
    board: [card("J", "clubs"), card("7", "diamonds"), card("3", "spades")],
    history: [
      { actor: "BTN", action: "raise", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
    ],
    options: [option("check"), option("bet", 2.1), option("bet", 4.3)],
    bestAction: "bet",
    frequencies: [frequency("bet", 72, 1.31), frequency("check", 28, 1.12)],
    explanation:
      "Top pair with a strong kicker benefits from a small, frequent value bet. The dry board keeps the sizing efficient while weaker jacks and pocket pairs continue.",
  }),
  makeSpot({
    id: "co-btn-preflop-threebet",
    title: "CO vs BTN",
    category: "Preflop 3-bets",
    difficulty: "Foundation",
    street: "preflop",
    positions: ["CO", "BTN"],
    stack: 50,
    pot: 4,
    heroCards: [card("A", "hearts"), card("Q", "clubs")],
    board: [],
    history: [
      { actor: "CO", action: "raise", amountBb: 2.3 },
      { actor: "BTN", action: "raise", amountBb: 7.5 },
    ],
    options: [option("fold"), option("call", 5.2), option("raise", 18)],
    bestAction: "call",
    frequencies: [
      frequency("call", 64, 0.48),
      frequency("raise", 21, 0.41),
      frequency("fold", 15, 0.08),
    ],
    explanation:
      "AQ offsuit retains enough equity to continue, but four-betting every combination overexposes the range. Calling keeps dominated aces and bluffs in play.",
  }),
  makeSpot({
    id: "sb-bb-limp-pot",
    title: "SB vs BB",
    category: "Blind battles",
    difficulty: "Foundation",
    street: "flop",
    positions: ["SB", "BB"],
    stack: 25,
    pot: 2,
    heroCards: [card("K", "diamonds"), card("8", "diamonds")],
    board: [card("K", "clubs"), card("9", "spades"), card("4", "hearts")],
    history: [
      { actor: "SB", action: "call", amountBb: 0.5 },
      { actor: "BB", action: "check" },
    ],
    options: [option("check"), option("bet", 1), option("bet", 1.5)],
    bestAction: "bet",
    frequencies: [frequency("bet", 69, 0.72), frequency("check", 31, 0.62)],
    explanation:
      "Top pair wants value and protection in a wide blind-versus-blind range. A half-pot bet captures both without bloating the pot.",
  }),
  makeSpot({
    id: "bb-btn-turn-defense",
    title: "BB vs BTN",
    category: "Turn defense",
    difficulty: "Advanced",
    street: "turn",
    positions: ["BB", "BTN"],
    stack: 40,
    pot: 11,
    heroCards: [card("9", "clubs"), card("8", "clubs")],
    board: [
      card("T", "clubs"),
      card("7", "hearts"),
      card("2", "spades"),
      card("K", "clubs"),
    ],
    history: [
      { actor: "BTN", action: "raise", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "BTN", action: "bet", amountBb: 3 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "BTN", action: "bet", amountBb: 7.5 },
    ],
    options: [option("fold"), option("call", 7.5), option("raise", 24)],
    bestAction: "call",
    frequencies: [
      frequency("call", 58, 0.86),
      frequency("raise", 14, 0.71),
      frequency("fold", 28, 0),
    ],
    explanation:
      "The open-ended straight draw plus flush draw has substantial equity and excellent river coverage. Calling realizes that equity without forcing out bluffs.",
  }),
  makeSpot({
    id: "btn-sb-threebet-flop",
    title: "BTN vs SB",
    category: "3-bet pots",
    difficulty: "Advanced",
    street: "flop",
    positions: ["BTN", "SB"],
    stack: 45,
    pot: 17,
    heroCards: [card("Q", "spades"), card("Q", "diamonds")],
    board: [card("A", "clubs"), card("8", "spades"), card("3", "hearts")],
    history: [
      { actor: "BTN", action: "raise", amountBb: 2.5 },
      { actor: "SB", action: "raise", amountBb: 9 },
      { actor: "BTN", action: "call" },
      { actor: "SB", action: "check" },
    ],
    options: [option("check"), option("bet", 4.2), option("bet", 8.5)],
    bestAction: "check",
    frequencies: [frequency("check", 77, 1.46), frequency("bet", 23, 1.29)],
    explanation:
      "Queens have showdown value but little need for protection on this ace-high board. Checking protects the middle of the range and controls the pot.",
  }),
  makeSpot({
    id: "hj-bb-river-value",
    title: "HJ vs BB",
    category: "River value",
    difficulty: "Intermediate",
    street: "river",
    positions: ["HJ", "BB"],
    stack: 60,
    pot: 22,
    heroCards: [card("K", "spades"), card("Q", "spades")],
    board: [
      card("K", "hearts"),
      card("Q", "clubs"),
      card("6", "spades"),
      card("2", "diamonds"),
      card("8", "clubs"),
    ],
    history: [
      { actor: "HJ", action: "raise", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "HJ", action: "bet", amountBb: 3 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "HJ", action: "bet", amountBb: 8 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
    ],
    options: [option("check"), option("bet", 14.5), option("bet", 22)],
    bestAction: "bet",
    frequencies: [frequency("bet", 91, 3.08), frequency("check", 9, 2.21)],
    explanation:
      "Top two pair remains ahead of many one-pair bluff-catchers. A two-thirds-pot value bet targets kings while avoiding an unnecessarily polarized shove.",
  }),
  makeSpot({
    id: "utg-btn-preflop-discipline",
    title: "UTG vs BTN",
    category: "Preflop discipline",
    difficulty: "Foundation",
    street: "preflop",
    positions: ["UTG", "BTN"],
    stack: 100,
    pot: 4,
    heroCards: [card("A", "clubs"), card("T", "diamonds")],
    board: [],
    history: [
      { actor: "UTG", action: "raise", amountBb: 2.5 },
      { actor: "BTN", action: "raise", amountBb: 8.5 },
    ],
    options: [option("fold"), option("call", 6), option("raise", 22)],
    bestAction: "fold",
    frequencies: [
      frequency("fold", 84, 0),
      frequency("call", 13, -0.31),
      frequency("raise", 3, -0.55),
    ],
    explanation:
      "AT offsuit is dominated by the value portion of a button three-bet and realizes equity poorly out of position. Disciplined folds preserve the range.",
  }),
  makeSpot({
    id: "co-bb-turn-barrel",
    title: "CO vs BB",
    category: "Turn barrels",
    difficulty: "Intermediate",
    street: "turn",
    positions: ["CO", "BB"],
    stack: 35,
    pot: 10,
    heroCards: [card("A", "diamonds"), card("5", "diamonds")],
    board: [
      card("K", "diamonds"),
      card("7", "clubs"),
      card("2", "diamonds"),
      card("J", "spades"),
    ],
    history: [
      { actor: "CO", action: "raise", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "CO", action: "bet", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
    ],
    options: [option("check"), option("bet", 7.5)],
    bestAction: "bet",
    frequencies: [frequency("bet", 62, 0.65), frequency("check", 38, 0.48)],
    explanation:
      "The nut-flush draw blocks strong continues and can improve on many rivers. A larger turn barrel creates fold equity while building the pot for made flushes.",
  }),
  makeSpot({
    id: "bb-sb-river-bluffcatch",
    title: "BB vs SB",
    category: "River bluff-catching",
    difficulty: "Advanced",
    street: "river",
    positions: ["BB", "SB"],
    stack: 30,
    pot: 18,
    heroCards: [card("A", "spades"), card("9", "hearts")],
    board: [
      card("A", "clubs"),
      card("J", "diamonds"),
      card("6", "clubs"),
      card("4", "spades"),
      card("T", "diamonds"),
    ],
    history: [
      { actor: "SB", action: "raise", amountBb: 3 },
      { actor: "BB", action: "call" },
      { actor: "SB", action: "bet", amountBb: 3 },
      { actor: "BB", action: "call" },
      { actor: "SB", action: "bet", amountBb: 7 },
      { actor: "BB", action: "call" },
      { actor: "SB", action: "bet", amountBb: 14 },
    ],
    options: [option("fold"), option("call", 14)],
    bestAction: "fold",
    frequencies: [frequency("fold", 74, 0), frequency("call", 26, -0.39)],
    explanation:
      "This bluff-catcher blocks several natural missed draws while unblocking value. Against the large river sizing, stronger aces make cleaner calls.",
  }),
  makeSpot({
    id: "btn-bb-river-polarize",
    title: "BTN vs BB",
    category: "River aggression",
    difficulty: "Advanced",
    street: "river",
    positions: ["BTN", "BB"],
    stack: 50,
    pot: 16,
    heroCards: [card("8", "spades"), card("7", "spades")],
    board: [
      card("A", "spades"),
      card("K", "clubs"),
      card("5", "diamonds"),
      card("2", "hearts"),
      card("Q", "clubs"),
    ],
    history: [
      { actor: "BTN", action: "raise", amountBb: 2.5 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "BTN", action: "bet", amountBb: 2 },
      { actor: "BB", action: "call" },
      { actor: "BB", action: "check" },
      { actor: "BTN", action: "check" },
      { actor: "BB", action: "check" },
    ],
    options: [option("check"), option("bet", 12), option("bet", 24)],
    bestAction: "bet",
    frequencies: [frequency("bet", 56, 0.27), frequency("check", 44, 0)],
    explanation:
      "With little showdown value, this missed draw can enter a polarized river bluff range. The overbet pressures one-pair hands while strong made hands balance the line.",
  }),
] as const;

export const getTrainingSpot = (spotId: string): TrainingSpot | undefined =>
  trainingSpots.find((spot) => spot.id === spotId);
