import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";

const ranks = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;

const handLabel = (row: number, column: number) => {
  if (row === column) return `${ranks[row]}${ranks[column]}`;
  return row < column
    ? `${ranks[row]}${ranks[column]}s`
    : `${ranks[column]}${ranks[row]}o`;
};

const frequencyFor = (row: number, column: number) =>
  (row * 17 + column * 29 + 41) % 100;

const actionFor = (frequency: number) => {
  if (frequency >= 67) return { label: "BET", color: colors.hotRed };
  if (frequency >= 38) return { label: "CALL", color: colors.cyan };
  if (frequency >= 18) return { label: "CHECK", color: colors.purple };
  return { label: "FOLD", color: colors.red };
};

export function RangeModal({
  visible,
  onClose,
}: {
  readonly visible: boolean;
  readonly onClose: () => void;
}) {
  const [selected, setSelected] = useState({ row: 0, column: 1 });
  const selectedFrequency = frequencyFor(selected.row, selected.column);
  const selectedAction = actionFor(selectedFrequency);
  const selectedLabel = handLabel(selected.row, selected.column);

  return (
    <Modal
      allowSwipeDismissal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Practice model</Text>
              <Text style={styles.title}>Range explorer</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close range"
              hitSlop={12}
              onPress={onClose}
              style={styles.close}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.description}>
              Tap a combo to inspect its battle frequency. This practice model
              is illustrative and is not solver-verified strategy.
            </Text>
            <View style={styles.inspector}>
              <View>
                <Text style={styles.handLabel}>{selectedLabel}</Text>
                <Text style={styles.handMeta}>Selected combo</Text>
              </View>
              <View style={styles.inspectorRight}>
                <Text
                  style={[
                    styles.primaryAction,
                    { color: selectedAction.color },
                  ]}
                >
                  {selectedAction.label}
                </Text>
                <Text style={styles.primaryFrequency}>
                  {selectedFrequency}%
                </Text>
              </View>
              <View style={styles.inspectorTrack}>
                <View
                  style={[
                    styles.inspectorFill,
                    {
                      width: `${selectedFrequency}%`,
                      backgroundColor: selectedAction.color,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.matrix}>
              {ranks.map((_, row) => (
                <View key={row} style={styles.matrixRow}>
                  {ranks.map((__, column) => {
                    const frequency = frequencyFor(row, column);
                    const action = actionFor(frequency);
                    const active =
                      selected.row === row && selected.column === column;
                    return (
                      <Pressable
                        key={column}
                        accessibilityRole="button"
                        onPress={() => setSelected({ row, column })}
                        style={[styles.cell, active && styles.cellActive]}
                        accessibilityLabel={`${handLabel(row, column)}, ${frequency} percent`}
                      >
                        <View
                          style={[
                            styles.cellMix,
                            {
                              height: `${Math.max(18, frequency)}%`,
                              backgroundColor: action.color,
                            },
                          ]}
                        />
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={[
                            styles.cellText,
                            active && styles.cellTextActive,
                          ]}
                        >
                          {handLabel(row, column)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
            <View style={styles.legend}>
              {["BET", "CALL", "CHECK", "FOLD"].map((label) => {
                const color = {
                  BET: colors.hotRed,
                  CALL: colors.cyan,
                  CHECK: colors.purple,
                  FOLD: colors.red,
                }[label];
                return (
                  <View key={label} style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: color }]}
                    />
                    <Text style={styles.legendText}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  eyebrow: {
    color: colors.gold,
    ...typography.secondary,
    fontWeight: "700",
  },
  title: {
    color: colors.textPrimary,
    ...typography.title,
    marginTop: 2,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: colors.textPrimary, fontSize: 28, lineHeight: 31 },
  content: { padding: spacing.lg, gap: spacing.lg },
  description: { color: colors.textSecondary, ...typography.secondary },
  inspector: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
  },
  handLabel: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  handMeta: {
    color: colors.cyan,
    ...typography.caption,
    fontWeight: "700",
  },
  inspectorRight: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  primaryAction: { ...typography.label },
  primaryFrequency: {
    color: colors.textPrimary,
    ...typography.title,
    fontVariant: ["tabular-nums"],
  },
  inspectorTrack: {
    width: "100%",
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSubtle,
    overflow: "hidden",
  },
  inspectorFill: { height: "100%", borderRadius: radius.pill },
  matrix: {
    width: "100%",
    aspectRatio: 1,
    gap: 2,
    padding: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.borderSubtle,
  },
  matrixRow: { flex: 1, flexDirection: "row", gap: 2 },
  cell: {
    flex: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.arenaDark,
  },
  cellActive: {
    borderWidth: 2,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.65,
    shadowRadius: 6,
  },
  cellMix: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.52,
  },
  cellText: {
    color: colors.textPrimary,
    fontSize: 7,
    fontWeight: "800",
    zIndex: 2,
  },
  cellTextActive: { color: colors.white },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { color: colors.textMuted, ...typography.caption },
});
