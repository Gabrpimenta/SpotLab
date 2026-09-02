import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import type { SpotAction } from "@/src/types/poker";

export function ActionTimeline({
  history,
}: {
  readonly history: readonly SpotAction[];
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Action history</Text>
      <View style={styles.row}>
        {history.slice(-4).map((item, index) => (
          <View
            key={`${item.actor}-${item.action}-${index}`}
            style={styles.step}
          >
            <Text style={styles.index}>{index + 1}</Text>
            <View style={styles.copy}>
              <Text style={styles.position}>{item.actor}</Text>
              <Text numberOfLines={1} style={styles.action}>
                {item.action.toUpperCase()}
                {item.amountBb ? ` ${item.amountBb}` : ""}
              </Text>
            </View>
            {index < history.slice(-4).length - 1 ? (
              <View style={styles.divider} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {
    color: colors.textMuted,
    ...typography.caption,
    fontWeight: "700",
  },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
  },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: spacing.xs,
  },
  index: { color: colors.textMuted, fontSize: 9, fontWeight: "800" },
  copy: { flex: 1, minWidth: 0 },
  position: { color: colors.cyan, fontSize: 9, fontWeight: "800" },
  action: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xs,
  },
});
