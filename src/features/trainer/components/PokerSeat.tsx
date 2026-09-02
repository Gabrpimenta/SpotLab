import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { typography } from "@/src/design-system/typography";
import { PlayerAvatar } from "@/src/features/trainer/components/PlayerAvatar";

export function PokerSeat({
  name,
  position,
  stack,
  hero = false,
  active = false,
  folded = false,
  action,
  dealer = false,
  compact = false,
}: {
  readonly name: string;
  readonly position: string;
  readonly stack: number;
  readonly hero?: boolean;
  readonly active?: boolean;
  readonly folded?: boolean;
  readonly action?: string;
  readonly dealer?: boolean;
  readonly compact?: boolean;
}) {
  return (
    <View
      style={[
        styles.seat,
        compact && styles.compact,
        active && styles.active,
        folded && styles.folded,
      ]}
      accessibilityLabel={`${hero ? "You" : name}, ${position}, ${stack} big blinds${action ? `, ${action}` : ""}`}
    >
      <View>
        <PlayerAvatar
          name={name}
          variant={hero ? "hero" : "atlas"}
          size={compact ? 26 : 34}
        />
        <View style={[styles.position, compact && styles.positionCompact]}>
          <Text style={styles.positionText}>{position}</Text>
        </View>
        {dealer ? (
          <View style={styles.dealer}>
            <Text style={styles.dealerText}>D</Text>
          </View>
        ) : null}
      </View>
      {!compact ? (
        <View style={styles.copy}>
          <Text style={styles.name}>{hero ? "You" : name}</Text>
          <Text style={styles.stack}>{stack} BB</Text>
        </View>
      ) : null}
      {action ? (
        <View style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  seat: {
    minWidth: 118,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(24,8,45,0.94)",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  compact: { minWidth: 0, minHeight: 0, padding: 3, borderRadius: radius.pill },
  active: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.52,
    shadowRadius: 11,
  },
  folded: { opacity: 0.32 },
  copy: { flex: 1 },
  name: { color: colors.textPrimary, ...typography.caption, fontWeight: "700" },
  stack: {
    color: colors.textSecondary,
    ...typography.caption,
    fontVariant: ["tabular-nums"],
  },
  position: {
    position: "absolute",
    bottom: -3,
    right: -5,
    minWidth: 22,
    height: 16,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panelInteractive,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  positionCompact: { right: -7, bottom: -4 },
  positionText: { color: colors.textPrimary, fontSize: 7, fontWeight: "800" },
  dealer: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.whiteCard,
    borderWidth: 1,
    borderColor: "rgba(16,4,31,0.28)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  dealerText: { color: colors.blackCard, fontSize: 9, fontWeight: "900" },
  action: {
    position: "absolute",
    right: -8,
    bottom: -13,
    backgroundColor: colors.cyan,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actionText: { color: colors.black, fontSize: 8, fontWeight: "900" },
});
