import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/design-system/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Spot not found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This spot is off the table.</Text>
        <Text style={styles.copy}>
          Return home and choose another training scenario.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  copy: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
});
