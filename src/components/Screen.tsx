import type { PropsWithChildren, RefObject } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ScrollViewProps,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { colors } from "@/src/design-system/colors";
import { gradients } from "@/src/design-system/gradients";
import { spacing } from "@/src/design-system/spacing";
import { ArenaBackdrop } from "@/src/components/game/ArenaBackdrop";

interface ScreenProps extends PropsWithChildren {
  readonly scroll?: boolean;
  readonly contentStyle?: StyleProp<ViewStyle>;
  readonly edges?: ("top" | "right" | "bottom" | "left")[];
  readonly underlapTop?: boolean;
  readonly scrollProps?: Omit<ScrollViewProps, "contentContainerStyle">;
  readonly scrollRef?: RefObject<ScrollView | null>;
}

export function Screen({
  children,
  scroll = true,
  contentStyle,
  edges = ["top"],
  underlapTop = false,
  scrollProps,
  scrollRef,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const safeEdges = underlapTop
    ? edges.filter((edge) => edge !== "top")
    : edges;
  const underlapContentStyle = underlapTop
    ? { paddingTop: insets.top + spacing.sm }
    : undefined;
  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        styles.content,
        contentStyle,
        underlapContentStyle,
      ]}
      contentInsetAdjustmentBehavior={underlapTop ? "never" : undefined}
      scrollIndicatorInsets={underlapTop ? { top: insets.top } : undefined}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.canvas}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ArenaBackdrop />
      <SafeAreaView style={styles.flex} edges={safeEdges}>
        {content}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.massive },
});
