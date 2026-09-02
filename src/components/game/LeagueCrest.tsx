import { LinearGradient } from "expo-linear-gradient";
import { Crown } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";
import { gradients } from "@/src/design-system/gradients";
import { radius } from "@/src/design-system/radius";
import { shadows } from "@/src/design-system/shadows";
import { spacing } from "@/src/design-system/spacing";

export function LeagueCrest({
  rating,
  tier,
  compact = false,
}: {
  readonly rating: number;
  readonly tier: string;
  readonly compact?: boolean;
}) {
  return (
    <LinearGradient
      colors={
        compact ? ["transparent", "transparent"] : gradients.goldAchievement
      }
      style={[
        styles.crest,
        !compact && shadows.gold,
        compact && styles.compact,
      ]}
    >
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={["#75D9FF", "#205B9D", "#0A2349", "#4BAFFF"]}
          style={[styles.medallion, compact && styles.compactMedallion]}
        >
          <View style={styles.medallionTrack}>
            <LinearGradient
              colors={["#18345B", "#030914", "#0A1933"]}
              style={styles.medallionFace}
            >
              <Crown
                color={colors.gold}
                strokeWidth={2.6}
                size={compact ? 13 : 15}
              />
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
      <View style={[styles.copy, compact && styles.compactCopy]}>
        <Text style={[styles.label, compact && styles.compactLabel]}>
          RATING
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.rating, compact && styles.compactRating]}
        >
          {rating.toLocaleString("en-US")}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.tier, compact && styles.compactTier]}
        >
          {tier}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  crest: {
    minWidth: 116,
    minHeight: 76,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 101, 0.38)",
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  compact: {
    minWidth: 118,
    minHeight: 52,
    flexShrink: 0,
    padding: 0,
    borderWidth: 0,
    justifyContent: "flex-end",
    gap: 8,
  },
  iconWrap: { alignItems: "center", justifyContent: "center" },
  medallion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(162,229,255,0.78)",
    shadowColor: "#39B8FF",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  compactMedallion: { width: 34, height: 34, borderRadius: 17, padding: 2.5 },
  medallionTrack: {
    flex: 1,
    padding: 2,
    borderRadius: 999,
    backgroundColor: "#071221",
  },
  medallionFace: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(116,216,255,0.22)",
  },
  copy: {
    minWidth: 0,
    flexShrink: 0,
    justifyContent: "center",
  },
  compactCopy: {
    minWidth: 72,
    paddingRight: 3,
  },
  label: {
    color: colors.gold,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  compactLabel: { fontSize: 8, lineHeight: 9, letterSpacing: 0.75 },
  rating: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: -0.65,
    fontVariant: ["tabular-nums"],
  },
  compactRating: { fontSize: 21, lineHeight: 23 },
  tier: {
    color: colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  compactTier: { color: "#AFA6BA", fontSize: 9.5, lineHeight: 12 },
});
