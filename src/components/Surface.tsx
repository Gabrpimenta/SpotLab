import type { PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";
import { shadows } from "@/src/design-system/shadows";

export function Surface({
  style,
  framed = false,
  ...props
}: PropsWithChildren<ViewProps> & {
  readonly framed?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.surface, framed && styles.framed, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadows.card,
  },
  framed: {
    borderColor: colors.border,
    borderWidth: 1,
  },
});
