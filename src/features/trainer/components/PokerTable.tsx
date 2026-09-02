import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { PlayingCard } from "@/src/features/trainer/components/PlayingCard";
import { PokerSeat } from "@/src/features/trainer/components/PokerSeat";
import type { PlayerPosition, TrainingSpot } from "@/src/types/poker";

const tablePositions: readonly PlayerPosition[] = [
  "UTG",
  "HJ",
  "CO",
  "BTN",
  "SB",
  "BB",
];

function ChipStack() {
  return (
    <View style={styles.chips} accessibilityElementsHidden>
      <View style={[styles.chip, styles.chipThree]} />
      <View style={[styles.chip, styles.chipTwo]} />
      <View style={styles.chip} />
    </View>
  );
}

export const PokerTable = memo(function PokerTable({
  spot,
}: {
  readonly spot: TrainingSpot;
}) {
  const { width } = useWindowDimensions();
  const tableHeight = Math.min(332, Math.max(320, (width - 40) * 0.92));
  const foundation = spot.difficulty === "Foundation";
  const lastVillainAction = [...spot.history]
    .reverse()
    .find((item) => item.actor === spot.villain.position);
  const inactive = tablePositions.filter(
    (position) =>
      position !== spot.hero.position && position !== spot.villain.position,
  );

  return (
    <View
      style={styles.shell}
      accessibilityLabel={`Six-seat poker table. Pot ${spot.potBb} big blinds. Action on you.`}
    >
      <LinearGradient
        colors={["#25102F", "#0B0710", "#21102B"]}
        style={[styles.table, { height: tableHeight }]}
      >
        <View
          style={[
            styles.tableFrame,
            foundation ? styles.tableFrameFoundation : styles.tableFrameArena,
          ]}
        >
          <LinearGradient
            colors={
              foundation
                ? ["#207C58", "#124B3A", "#092B25"]
                : ["#9A1C64", "#5E174F", "#30113B"]
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.felt}
          >
            <View style={styles.feltHighlight} />
            <View style={styles.innerRim} />
          </LinearGradient>
        </View>
        <View style={styles.villainSeat}>
          <PokerSeat
            name="Atlas"
            position={spot.villain.position}
            stack={spot.villain.stackBb}
            action={
              lastVillainAction
                ? `${lastVillainAction.action.toUpperCase()}${lastVillainAction.amountBb ? ` ${lastVillainAction.amountBb}` : ""}`
                : undefined
            }
          />
        </View>

        {inactive.slice(0, 4).map((position, index) => (
          <View
            key={position}
            style={[
              styles.inactiveSeat,
              index === 0 && styles.inactiveTopLeft,
              index === 1 && styles.inactiveTopRight,
              index === 2 && styles.inactiveBottomLeft,
              index === 3 && styles.inactiveBottomRight,
            ]}
          >
            <PokerSeat
              name={position}
              position={position}
              stack={spot.effectiveStackBb}
              folded
              compact
            />
          </View>
        ))}

        <View style={styles.center}>
          <View style={styles.potRow}>
            <ChipStack />
            <View style={styles.pot}>
              <Text style={styles.potLabel}>POT</Text>
              <Text style={styles.potValue}>{spot.potBb} BB</Text>
            </View>
          </View>
          <View style={styles.board}>
            {spot.board.length ? (
              spot.board.map((boardCard, index) => (
                <PlayingCard
                  key={`${boardCard.rank}-${boardCard.suit}`}
                  card={boardCard}
                  size="small"
                  enterDelay={90 + index * 70}
                />
              ))
            ) : (
              <View style={styles.preflopBadge}>
                <Text style={styles.preflop}>Preflop</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.holeCards}>
          {spot.heroCards.map((heroCard, index) => (
            <View
              key={`${heroCard.rank}-${heroCard.suit}`}
              style={index === 0 ? styles.cardLeft : styles.cardRight}
            >
              <PlayingCard
                card={heroCard}
                size="hero"
                highlighted
                enterDelay={420 + index * 90}
              />
            </View>
          ))}
        </View>
        <View style={styles.heroSeat}>
          <PokerSeat
            name="Hero"
            position={spot.hero.position}
            stack={spot.hero.stackBb}
            hero
            active
            dealer={spot.hero.position === "BTN"}
          />
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  shell: {
    padding: 4,
    borderRadius: radius.game,
    backgroundColor: "rgba(7,2,14,0.88)",
    borderWidth: 1,
    borderColor: "rgba(179,99,255,0.34)",
    shadowColor: colors.ultraviolet,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  table: {
    borderRadius: radius.xxl,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  tableFrame: {
    position: "absolute",
    top: 52,
    right: 10,
    bottom: 54,
    left: 10,
    padding: 6,
    borderRadius: 110,
    borderWidth: 1,
    shadowOpacity: 0.34,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  tableFrameFoundation: {
    backgroundColor: "#173E37",
    borderColor: "rgba(67,243,176,0.58)",
    shadowColor: colors.green,
  },
  tableFrameArena: {
    backgroundColor: "#35123F",
    borderColor: "rgba(255,201,77,0.52)",
    shadowColor: colors.magenta,
  },
  felt: {
    flex: 1,
    borderRadius: 102,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  feltHighlight: {
    position: "absolute",
    top: -34,
    left: "18%",
    width: "64%",
    height: 86,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  innerRim: {
    position: "absolute",
    top: 7,
    right: 7,
    bottom: 7,
    left: 7,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  villainSeat: { position: "absolute", top: 16, zIndex: 4 },
  inactiveSeat: { position: "absolute", zIndex: 2 },
  inactiveTopLeft: { left: 8, top: 90 },
  inactiveTopRight: { right: 8, top: 90 },
  inactiveBottomLeft: { left: 8, bottom: 88 },
  inactiveBottomRight: { right: 8, bottom: 88 },
  center: {
    position: "absolute",
    top: 80,
    alignItems: "center",
    gap: spacing.sm,
  },
  potRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  pot: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(16,4,31,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,201,77,0.30)",
  },
  potLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  potValue: {
    color: colors.gold,
    ...typography.bodyStrong,
    fontVariant: ["tabular-nums"],
  },
  chips: { width: 20, height: 17 },
  chip: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: "#FFF0A9",
  },
  chipTwo: { bottom: 5, left: 1 },
  chipThree: { bottom: 10, left: 2 },
  board: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 5 },
  preflopBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.panel,
  },
  preflop: { color: colors.cyan, ...typography.label },
  heroSeat: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    zIndex: 5,
  },
  holeCards: {
    position: "absolute",
    bottom: 78,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    zIndex: 6,
  },
  cardLeft: { transform: [{ rotate: "-1.5deg" }, { translateX: 1 }] },
  cardRight: { transform: [{ rotate: "1.5deg" }, { translateX: -1 }] },
});
