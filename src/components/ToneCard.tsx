import { useId, useState, type PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";
import { spacing } from "@/src/design-system/spacing";

type ToneCardTone =
  "neutral" | "info" | "warning" | "accent" | "insight" | "success";
type ToneCardSide = "left" | "right";

const toneColor: Record<ToneCardTone, string> = {
  neutral: colors.textMuted,
  info: colors.cyan,
  warning: colors.amber,
  accent: colors.hotRed,
  insight: colors.violet,
  success: colors.green,
};

export function ToneCard({
  accentSide = "right",
  children,
  contentStyle,
  style,
  tone = "neutral",
}: PropsWithChildren<{
  readonly accentSide?: ToneCardSide;
  readonly contentStyle?: StyleProp<ViewStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly tone?: ToneCardTone;
}>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const id = useId().replace(/:/g, "");
  const accent = toneColor[tone];

  const updateSize = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  return (
    <View onLayout={updateSize} style={[styles.card, style]}>
      {size.width > 0 && size.height > 0 ? (
        <ToneCardFrame
          accent={accent}
          accentSide={accentSide}
          height={size.height}
          id={id}
          emphasized={tone !== "neutral"}
          width={size.width}
        />
      ) : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

function ToneCardFrame({
  accent,
  accentSide,
  height,
  id,
  emphasized,
  width,
}: {
  readonly accent: string;
  readonly accentSide: ToneCardSide;
  readonly height: number;
  readonly id: string;
  readonly emphasized: boolean;
  readonly width: number;
}) {
  const edgeId = `tone-card-edge-${id}`;
  const glowId = `tone-card-glow-${id}`;
  const capId = `tone-card-cap-${id}`;
  const verticalCapId = `tone-card-vertical-cap-${id}`;
  const inset = 0.5;
  const frameRadius = radius.lg - inset;
  const centerX = accentSide === "left" ? 0 : width;
  const centerY = Math.min(56, Math.max(36, height * 0.2));
  const sideTaper = Math.min(168, Math.max(112, width * 0.4));
  const topTaper = Math.min(88, Math.max(58, height * 0.38));
  const rightEdge = width - inset;
  const capPath =
    accentSide === "left"
      ? [
          `M ${sideTaper} ${inset}`,
          `H ${frameRadius + inset}`,
          `A ${frameRadius} ${frameRadius} 0 0 0 ${inset} ${frameRadius + inset}`,
        ].join(" ")
      : [
          `M ${width - sideTaper} ${inset}`,
          `H ${width - frameRadius - inset}`,
          `A ${frameRadius} ${frameRadius} 0 0 1 ${rightEdge} ${frameRadius + inset}`,
        ].join(" ");
  const verticalCapPath =
    accentSide === "left"
      ? `M ${inset} ${frameRadius + inset} V ${frameRadius + topTaper}`
      : `M ${rightEdge} ${frameRadius + inset} V ${frameRadius + topTaper}`;

  return (
    <Svg
      height={height}
      pointerEvents="none"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <Defs>
        <RadialGradient
          cx={centerX}
          cy={centerY}
          gradientUnits="userSpaceOnUse"
          id={edgeId}
          rx={Math.min(150, Math.max(92, width * 0.34))}
          ry={Math.min(145, Math.max(72, height * 0.48))}
        >
          <Stop offset="0" stopColor={accent} stopOpacity={0.78} />
          <Stop offset="0.28" stopColor={accent} stopOpacity={0.32} />
          <Stop offset="1" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          cx={centerX}
          cy={centerY}
          gradientUnits="userSpaceOnUse"
          id={glowId}
          rx={Math.min(180, Math.max(112, width * 0.46))}
          ry={Math.min(170, Math.max(90, height * 0.58))}
        >
          <Stop offset="0" stopColor={accent} stopOpacity={0.055} />
          <Stop offset="1" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id={capId}
          x1={accentSide === "right" ? width - sideTaper : sideTaper}
          x2={accentSide === "right" ? width : 0}
          y1={0}
          y2={0}
        >
          <Stop offset="0" stopColor={accent} stopOpacity={0} />
          <Stop offset="0.72" stopColor={accent} stopOpacity={0.34} />
          <Stop offset="1" stopColor={accent} stopOpacity={0.64} />
        </LinearGradient>
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id={verticalCapId}
          x1={0}
          x2={0}
          y1={frameRadius + inset}
          y2={frameRadius + topTaper}
        >
          <Stop offset="0" stopColor={accent} stopOpacity={0.64} />
          <Stop offset="0.38" stopColor={accent} stopOpacity={0.34} />
          <Stop offset="1" stopColor={accent} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect
        fill={colors.surface}
        height={height}
        rx={radius.lg}
        width={width}
      />
      {emphasized ? (
        <Rect
          fill={`url(#${glowId})`}
          height={height}
          rx={radius.lg}
          width={width}
        />
      ) : null}
      <Rect
        fill="none"
        height={Math.max(0, height - inset * 2)}
        rx={frameRadius}
        stroke={colors.borderSubtle}
        strokeWidth={1}
        width={Math.max(0, width - inset * 2)}
        x={inset}
        y={inset}
      />
      {emphasized ? (
        <>
          <Rect
            fill="none"
            height={Math.max(0, height - inset * 2)}
            rx={frameRadius}
            stroke={`url(#${edgeId})`}
            strokeOpacity={0.34}
            strokeWidth={0.8}
            width={Math.max(0, width - inset * 2)}
            x={inset}
            y={inset}
          />
          <Path
            d={capPath}
            fill="none"
            stroke={`url(#${capId})`}
            strokeLinecap="round"
            strokeWidth={1.15}
          />
          <Path
            d={verticalCapPath}
            fill="none"
            stroke={`url(#${verticalCapId})`}
            strokeLinecap="round"
            strokeWidth={1.15}
          />
        </>
      ) : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  content: { padding: spacing.md, zIndex: 1 },
});
