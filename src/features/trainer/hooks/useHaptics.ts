import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const safely = (effect: () => Promise<void>) => {
  if (Platform.OS === "web") return;
  void effect().catch(() => undefined);
};

export const useHaptics = () => ({
  selection: () =>
    safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () =>
    safely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),
  warning: () =>
    safely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    ),
});
