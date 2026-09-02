import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import type { DecisionOption } from "@/src/types/poker";

export function DecisionButton({
  option,
  onPress,
  disabled,
  selected,
}: {
  readonly option: DecisionOption;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${option.label}${option.amountBb ? ` ${option.amountBb} big blinds` : ""}`}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.selected,
        disabled && !selected && styles.disabled,
        { transform: [{ scale: pressed ? 0.96 : selected ? 0.98 : 1 }] },
      ]}
    >
      <View>
        <Text style={[styles.label, selected && styles.selectedText]}>
          {option.label}
        </Text>
        <Text style={styles.amount}>
          {option.amountBb ? `${option.amountBb} BB` : "—"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xs,
  },
  selected: { backgroundColor: colors.accent, borderColor: colors.accent },
  disabled: { opacity: 0.42 },
  label: { color: colors.textPrimary, ...typography.label, fontSize: 13 },
  selectedText: { color: colors.accentInk },
  amount: {
    color: colors.textSecondary,
    ...typography.caption,
    textAlign: "center",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
});
