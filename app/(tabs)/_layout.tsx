import { SymbolView } from "expo-symbols";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { colors } from "@/src/design-system/colors";

function TabGlyph({
  focused,
  color,
  ios,
  fallback,
}: {
  readonly focused: boolean;
  readonly color: string;
  readonly ios: "house.fill" | "scope" | "chart.line.uptrend.xyaxis";
  readonly fallback: "home" | "target" | "analytics";
}) {
  return (
    <View style={styles.glyph}>
      <SymbolView
        name={{ ios, android: fallback, web: fallback }}
        tintColor={color}
        size={focused ? 21 : 20}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={78}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(20,16,30,0.88)", "rgba(10,8,15,0.98)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Battle",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph
              focused={focused}
              color={color as string}
              ios="house.fill"
              fallback="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: "Missions",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph
              focused={focused}
              color={color as string}
              ios="scope"
              fallback="target"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "League",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph
              focused={focused}
              color={color as string}
              ios="chart.line.uptrend.xyaxis"
              fallback="analytics"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingTop: 6,
    paddingBottom: 5,
    backgroundColor: "rgba(12, 9, 20, 0.92)",
    borderTopColor: "rgba(255,255,255,0.06)",
    borderTopWidth: 1,
  },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.2 },
  glyph: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
