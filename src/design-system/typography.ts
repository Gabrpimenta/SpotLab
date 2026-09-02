import type { TextStyle } from "react-native";

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 37,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  heroMetric: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  title: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  battle: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  section: { fontSize: 19, lineHeight: 24, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 23, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: "600" },
  secondary: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  label: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.7,
  },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: "500" },
} satisfies Record<string, TextStyle>;
