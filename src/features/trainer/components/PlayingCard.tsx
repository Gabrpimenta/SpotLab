import Animated, { FadeInDown } from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import type {
  PlayingCard as PlayingCardModel,
  PokerSuit,
} from "@/src/types/poker";

const suitSymbol: Record<PokerSuit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};
const redSuits: readonly PokerSuit[] = ["hearts", "diamonds"];

interface PlayingCardProps {
  readonly card?: PlayingCardModel;
  readonly size?: "mini" | "small" | "medium" | "hero";
  readonly faceDown?: boolean;
  readonly enterDelay?: number;
  readonly dark?: boolean;
  readonly highlighted?: boolean;
}

export function PlayingCard({
  card,
  size = "medium",
  faceDown = false,
  enterDelay = 0,
  dark = false,
  highlighted = false,
}: PlayingCardProps) {
  const isRed = card ? redSuits.includes(card.suit) : false;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(enterDelay)}
      style={[
        styles.card,
        styles[size],
        dark && styles.dark,
        highlighted && styles.highlighted,
        faceDown && styles.back,
      ]}
      accessibilityLabel={
        card && !faceDown ? `${card.rank} of ${card.suit}` : "Face-down card"
      }
    >
      {faceDown || !card ? (
        <View style={styles.backMark}>
          <Text style={styles.backText}>S</Text>
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.rank,
              styles[`${size}Rank`],
              dark && styles.darkText,
              isRed && styles.red,
            ]}
          >
            {card.rank}
          </Text>
          <Text
            style={[
              styles.suit,
              styles[`${size}Suit`],
              dark && styles.darkText,
              isRed && styles.red,
            ]}
          >
            {suitSymbol[card.suit]}
          </Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.whiteCard,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.42,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 5 },
  },
  mini: { width: 28, height: 38, borderRadius: 6 },
  small: { width: 38, height: 52 },
  medium: { width: 48, height: 66 },
  hero: { width: 42, height: 58, borderRadius: 9, borderWidth: 2 },
  rank: { color: "#14201D", fontWeight: "800", lineHeight: 22 },
  suit: { color: "#14201D", lineHeight: 19 },
  miniRank: { fontSize: 12, lineHeight: 13 },
  miniSuit: { fontSize: 11, lineHeight: 12 },
  smallRank: { fontSize: 16, lineHeight: 18 },
  smallSuit: { fontSize: 15, lineHeight: 17 },
  mediumRank: { fontSize: 20, lineHeight: 22 },
  mediumSuit: { fontSize: 19, lineHeight: 21 },
  heroRank: { fontSize: 20, lineHeight: 22 },
  heroSuit: { fontSize: 18, lineHeight: 20 },
  red: { color: colors.cardRed },
  dark: { backgroundColor: colors.blackCard, borderColor: colors.borderStrong },
  darkText: { color: colors.textPrimary },
  highlighted: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.52,
    shadowRadius: 12,
  },
  back: { backgroundColor: colors.surfaceElevated, borderColor: colors.violet },
  backMark: {
    width: "70%",
    height: "75%",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: colors.cyan, fontWeight: "800" },
});
