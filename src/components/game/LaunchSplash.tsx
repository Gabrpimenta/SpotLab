import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
  useReducedMotion,
} from "react-native-reanimated";

import { colors } from "@/src/design-system/colors";
import { radius } from "@/src/design-system/radius";

const brandMark = require("../../../assets/images/spotlab-app-icon.png");

export function LaunchSplash({ onFinish }: { readonly onFinish: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onFinish, reduceMotion ? 500 : 1650);
    return () => clearTimeout(timer);
  }, [onFinish, reduceMotion]);

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(reduceMotion ? 120 : 320)}
      pointerEvents="auto"
      style={styles.root}
    >
      <LinearGradient
        colors={["#2A1042", "#160822", "#09030F"]}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbCenter]} />
      <View style={styles.grid}>
        {Array.from({ length: 5 }, (_, index) => (
          <View key={index} style={[styles.gridLine, { top: index * 72 }]} />
        ))}
      </View>

      <View style={styles.center}>
        <Animated.View
          entering={
            reduceMotion
              ? FadeIn.duration(160)
              : ZoomIn.duration(520).springify().damping(13)
          }
          style={styles.markStage}
        >
          <View style={styles.markGlow} />
          <LinearGradient
            colors={[
              "rgba(255,61,103,0.34)",
              "rgba(197,37,235,0.18)",
              "rgba(55,229,248,0.12)",
            ]}
            style={styles.markRing}
          >
            <View style={styles.markInner}>
              <Image
                source={brandMark}
                contentFit="contain"
                accessible={false}
                style={styles.mark}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(reduceMotion ? 0 : 280).duration(420)}
          style={styles.copy}
        >
          <Text style={styles.wordmark}>SpotLab</Text>
          <Text style={styles.positioning}>MASTER THE NEXT DECISION</Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(reduceMotion ? 0 : 620).duration(380)}
        style={styles.footer}
      >
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[colors.hotRed, "#FF32AC", colors.cyan]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.progressFill}
          />
        </View>
        <Text style={styles.footerCopy}>Poker decision training</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orb: { position: "absolute", borderRadius: 999 },
  orbTop: {
    width: 370,
    height: 370,
    top: -225,
    right: -145,
    backgroundColor: "rgba(255,33,77,0.11)",
  },
  orbCenter: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(126,42,255,0.12)",
  },
  grid: {
    position: "absolute",
    width: "140%",
    height: 360,
    bottom: -150,
    opacity: 0.2,
    transform: [{ perspective: 400 }, { rotateX: "64deg" }],
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(179,99,255,0.24)",
  },
  center: { alignItems: "center", marginTop: -28 },
  markStage: {
    width: 178,
    height: 178,
    alignItems: "center",
    justifyContent: "center",
  },
  markGlow: {
    position: "absolute",
    width: 154,
    height: 154,
    borderRadius: 77,
    backgroundColor: "rgba(255,30,103,0.14)",
    shadowColor: "#FF2371",
    shadowOpacity: 0.58,
    shadowRadius: 32,
  },
  markRing: {
    width: 158,
    height: 158,
    borderRadius: 48,
    padding: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    transform: [{ rotate: "2deg" }],
  },
  markInner: {
    flex: 1,
    borderRadius: 47,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,3,18,0.78)",
    overflow: "hidden",
  },
  mark: { width: 142, height: 142 },
  copy: { alignItems: "center", marginTop: 18 },
  wordmark: {
    color: colors.white,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.4,
    textShadowColor: "rgba(255,64,132,0.28)",
    textShadowRadius: 14,
  },
  positioning: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 2.4,
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 58,
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    width: 92,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  progressFill: {
    width: "72%",
    height: "100%",
    borderRadius: radius.pill,
  },
  footerCopy: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
