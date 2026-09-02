import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { spacing } from "@/src/design-system/spacing";

export const starsForEvLoss = (evLoss: number) => {
  if (evLoss <= 0.03) return 5;
  if (evLoss <= 0.08) return 4;
  if (evLoss <= 0.15) return 4;
  if (evLoss <= 0.3) return 3;
  return 2;
};

export function RatingStars({ evLoss }: { readonly evLoss: number }) {
  const count = starsForEvLoss(evLoss);
  return (
    <View style={styles.row} accessibilityLabel={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Text key={index} style={[styles.star, index >= count && styles.empty]}>
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.xxs },
  star: { color: colors.gold, fontSize: 16, lineHeight: 19 },
  empty: { color: colors.borderStrong },
});
