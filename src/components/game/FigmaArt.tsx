import { useId } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import Animated, { ZoomIn, useReducedMotion } from "react-native-reanimated";

function GiftArt() {
  const id = useId().replace(/:/g, "");
  const glowId = `gift-glow-${id}`;
  const boxId = `gift-box-${id}`;
  const lidId = `gift-lid-${id}`;
  const ribbonId = `gift-ribbon-${id}`;
  const bowId = `gift-bow-${id}`;

  return (
    <Svg height="100%" viewBox="0 0 96 96" width="100%">
      <Defs>
        <RadialGradient id={glowId} cx="50%" cy="52%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#FF4D83" stopOpacity={0.24} />
          <Stop offset="0.68" stopColor="#D82E74" stopOpacity={0.1} />
          <Stop offset="1" stopColor="#D82E74" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={boxId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#DCA4FF" />
          <Stop offset="0.48" stopColor="#8F48D0" />
          <Stop offset="1" stopColor="#3C185D" />
        </LinearGradient>
        <LinearGradient id={lidId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F0C4FF" />
          <Stop offset="0.5" stopColor="#B15DE0" />
          <Stop offset="1" stopColor="#64268C" />
        </LinearGradient>
        <LinearGradient id={ribbonId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF5674" />
          <Stop offset="0.55" stopColor="#E31D4D" />
          <Stop offset="1" stopColor="#8D0A31" />
        </LinearGradient>
        <LinearGradient id={bowId} x1="0" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor="#FF5B79" />
          <Stop offset="0.52" stopColor="#EE2855" />
          <Stop offset="1" stopColor="#A30734" />
        </LinearGradient>
      </Defs>

      <Circle cx="48" cy="51" r="43" fill={`url(#${glowId})`} />
      <Ellipse cx="48" cy="82" rx="28" ry="6" fill="#05020A" opacity={0.38} />

      <Rect
        x="22"
        y="45"
        width="52"
        height="36"
        rx="7"
        fill={`url(#${boxId})`}
        stroke="#E1A7FF"
        strokeOpacity={0.46}
      />
      <Rect x="43.5" y="45" width="9" height="36" fill={`url(#${ribbonId})`} />
      <Path
        d="M27 50 C33 47 38 47 43 48 V76 C36 77 31 75 27 72 Z"
        fill="#FFFFFF"
        opacity={0.1}
      />

      <Path d="M46 43 L31 52 L38 34 Z" fill="#A50935" opacity={0.9} />
      <Path d="M50 43 L65 52 L58 34 Z" fill="#84082C" opacity={0.9} />
      <Rect
        x="17"
        y="39"
        width="62"
        height="15"
        rx="5.5"
        fill={`url(#${lidId})`}
        stroke="#F2C6FF"
        strokeOpacity={0.62}
      />
      <Rect x="43" y="39" width="10" height="15" fill={`url(#${ribbonId})`} />
      <Path
        d="M21 43 H74"
        stroke="#FFFFFF"
        strokeOpacity={0.18}
        strokeWidth="1.4"
      />

      <Path
        d="M47 38 C39 25 24 20 17 26 C9 33 19 42 45 43 Z"
        fill="none"
        stroke={`url(#${bowId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <Path
        d="M49 38 C57 25 72 20 79 26 C87 33 77 42 51 43 Z"
        fill="none"
        stroke={`url(#${bowId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <Circle
        cx="48"
        cy="40"
        r="8"
        fill={`url(#${bowId})`}
        stroke="#980A34"
        strokeWidth="2"
      />
      <Circle cx="46" cy="37.5" r="2.2" fill="#FF9BAE" opacity={0.42} />
    </Svg>
  );
}

function ChipsArt() {
  const id = useId().replace(/:/g, "");
  const faceId = `chip-face-${id}`;
  const edgeId = `chip-edge-${id}`;
  const goldId = `chip-gold-${id}`;

  return (
    <Svg height="100%" viewBox="0 0 72 72" width="100%">
      <Defs>
        <LinearGradient id={faceId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#234A70" />
          <Stop offset="0.48" stopColor="#10283F" />
          <Stop offset="1" stopColor="#07121F" />
        </LinearGradient>
        <LinearGradient id={edgeId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0E1C2B" />
          <Stop offset="0.52" stopColor="#070E18" />
          <Stop offset="1" stopColor="#02060B" />
        </LinearGradient>
        <LinearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFF0A0" />
          <Stop offset="0.48" stopColor="#FFC83D" />
          <Stop offset="1" stopColor="#D98B0C" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="36" cy="64" rx="23" ry="3.5" fill="#020508" opacity={0.42} />
      <Circle cx="36" cy="34" r="28" fill="#030811" />
      <Circle
        cx="36"
        cy="34"
        r="26"
        fill={`url(#${faceId})`}
        stroke="#3E719C"
        strokeWidth="1.5"
      />
      <Circle
        cx="36"
        cy="34"
        r="21.5"
        fill="none"
        stroke="#4DBDEB"
        strokeDasharray="9 5"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <Circle
        cx="36"
        cy="34"
        r="16.5"
        fill={`url(#${edgeId})`}
        stroke="#24435F"
        strokeWidth="1.2"
      />
      <Path
        d="M25.5 29 L28.5 40 H43.5 L46.5 29 L40.5 34 L36 25.5 L31.5 34 Z"
        fill="none"
        stroke={`url(#${goldId})`}
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
      <Path
        d="M28.5 44 H43.5"
        stroke="#FFD45A"
        strokeLinecap="round"
        strokeWidth="2.8"
      />
      <Path
        d="M19 17 C24 10 34 7 43 10"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeOpacity={0.18}
        strokeWidth="2.2"
      />
    </Svg>
  );
}

export function RewardBundle({
  kind = "gift",
  size = 72,
  style,
}: {
  readonly kind?: "gift" | "chips";
  readonly size?: number;
  readonly style?: StyleProp<ViewStyle>;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.reward, { width: size, height: size }, style]}
    >
      <Animated.View
        entering={reduceMotion ? undefined : ZoomIn.duration(300).springify()}
        style={kind === "gift" ? styles.gift : styles.chips}
      >
        {kind === "gift" ? <GiftArt /> : <ChipsArt />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  reward: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "transparent",
  },
  gift: { width: "92%", height: "92%" },
  chips: { width: "90%", height: "90%" },
});
