import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { PlayingCard } from "@/src/features/trainer/components/PlayingCard";
import type { TrainingSpot } from "@/src/types/poker";

export function SpotPreview({
  spot,
  height = 126,
}: {
  readonly spot: TrainingSpot;
  readonly height?: number;
}) {
  const foundation = spot.difficulty === "Foundation";
  const previewCards = spot.board.length
    ? spot.board.slice(0, 3)
    : spot.heroCards;

  return (
    <LinearGradient
      colors={["#33203F", "#120B19", "#2B163A"]}
      style={[
        styles.stage,
        foundation ? styles.stageFoundation : styles.stageArena,
        { height },
      ]}
      accessibilityLabel={`${spot.hero.position} versus ${spot.villain.position}, ${spot.street}, pot ${spot.potBb} big blinds`}
    >
      <LinearGradient
        colors={
          foundation
            ? ["#19704C", "#124B39", "#0B2F28"]
            : ["#8C1A5D", "#5D174F", "#35123F"]
        }
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.felt}
      >
        <View style={styles.feltHighlight} />
        <View style={styles.innerRim} />
      </LinearGradient>
      <View style={[styles.seat, styles.villain]}>
        <Text style={styles.seatText}>{spot.villain.position}</Text>
      </View>
      <View style={styles.pot}>
        <View style={styles.chipDot} />
        <View>
          <Text style={styles.potLabel}>POT</Text>
          <Text style={styles.potValue}>{spot.potBb} BB</Text>
        </View>
      </View>
      <View style={styles.board}>
        {previewCards.map((card) => (
          <PlayingCard
            key={`${card.rank}-${card.suit}`}
            card={card}
            size="mini"
          />
        ))}
      </View>
      <View style={[styles.seat, styles.hero]}>
        <Text style={[styles.seatText, styles.heroText]}>
          {spot.hero.position}
        </Text>
      </View>
      <View style={styles.dealer}>
        <Text style={styles.dealerText}>D</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    borderRadius: 72,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: colors.ultraviolet,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  stageFoundation: { borderColor: "rgba(67,243,176,0.42)" },
  stageArena: { borderColor: "rgba(179,99,255,0.62)" },
  felt: {
    position: "absolute",
    top: 9,
    right: 10,
    bottom: 9,
    left: 10,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  feltHighlight: {
    position: "absolute",
    top: -22,
    left: "18%",
    width: "64%",
    height: 54,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  innerRim: {
    position: "absolute",
    top: 6,
    right: 6,
    bottom: 6,
    left: 6,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  seat: {
    position: "absolute",
    minWidth: 48,
    height: 23,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(25,9,43,0.94)",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  villain: { top: 5 },
  hero: { bottom: 5, borderColor: colors.gold },
  seatText: { color: colors.textSecondary, fontSize: 9, fontWeight: "800" },
  heroText: { color: colors.gold },
  pot: {
    position: "absolute",
    left: 20,
    top: 44,
    minWidth: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(9,5,17,0.76)",
    borderWidth: 1,
    borderColor: "rgba(255,201,77,0.20)",
  },
  chipDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: "#FFF0A9",
  },
  potLabel: {
    color: colors.textSecondary,
    fontSize: 6,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  potValue: {
    color: colors.gold,
    fontSize: 10,
    lineHeight: 11,
    fontWeight: "900",
  },
  board: { flexDirection: "row", gap: 3 },
  dealer: {
    position: "absolute",
    right: 21,
    top: 53,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.whiteCard,
    alignItems: "center",
    justifyContent: "center",
  },
  dealerText: { color: colors.blackCard, fontSize: 8, fontWeight: "900" },
});
