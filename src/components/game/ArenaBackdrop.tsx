import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

export function ArenaBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg
        height="100%"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
        width="100%"
      >
        <Defs>
          <RadialGradient id="topWash" cx="92%" cy="0%" r="72%">
            <Stop offset="0" stopColor="#FF315B" stopOpacity={0.065} />
            <Stop offset="0.46" stopColor="#8B42FF" stopOpacity={0.025} />
            <Stop offset="1" stopColor="#0C0914" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="sideWash" cx="0%" cy="58%" r="58%">
            <Stop offset="0" stopColor="#8B42FF" stopOpacity={0.035} />
            <Stop offset="1" stopColor="#0C0914" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="depthFade" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor="#0C0914" stopOpacity={0} />
            <Stop offset="0.72" stopColor="#08070D" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#050408" stopOpacity={0.42} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#topWash)" height="100%" width="100%" />
        <Rect fill="url(#sideWash)" height="100%" width="100%" />
        <Rect fill="url(#depthFade)" height="100%" width="100%" />
      </Svg>
    </View>
  );
}
