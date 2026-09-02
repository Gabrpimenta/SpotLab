import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";

export function SectionHeader({
  title,
  action,
}: {
  readonly title: string;
  readonly action?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    ...typography.bodyStrong,
    fontWeight: "800",
  },
  action: {
    color: colors.textMuted,
    ...typography.caption,
    fontWeight: "600",
  },
});
