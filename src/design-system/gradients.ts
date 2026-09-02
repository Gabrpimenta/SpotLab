import { colors } from "@/src/design-system/colors";

export const gradients = {
  canvas: ["#171020", colors.canvas, "#08070D"] as const,
  arena: ["#8A2DFF", "#4A138E", "#230943"] as const,
  arenaDeep: ["#571CB0", "#250844", "#140723"] as const,
  felt: [colors.feltLight, colors.felt, colors.feltDark] as const,
  feltDeep: ["#6C20CF", colors.feltDark] as const,
  fire: ["#FF6542", colors.hotRed, "#9B0738"] as const,
  fireDark: ["#7B0A31", "#3A0929", "#1B0825"] as const,
  premium: ["#30203F", "#1D1728", "#14111C"] as const,
  purpleAnalysis: ["#2D2040", "#181321"] as const,
  goldAchievement: ["#6B4311", "#2C1B22"] as const,
  gold: ["#FFF0A0", "#FFC94D", "#E27B19"] as const,
  cyan: ["#64F5FF", "#25B8FF", "#275CE7"] as const,
  danger: ["#FF5571", "#F41648", "#8D082F"] as const,
  glass: ["rgba(35, 28, 50, 0.96)", "rgba(20, 17, 30, 0.98)"] as const,
} as const;
