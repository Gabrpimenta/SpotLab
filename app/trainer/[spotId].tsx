import { useLocalSearchParams } from "expo-router";

import { TrainerScreen } from "@/src/features/trainer/TrainerScreen";

export default function TrainerRoute() {
  const { spotId } = useLocalSearchParams<{ spotId: string }>();
  return <TrainerScreen initialSpotId={spotId ?? "btn-bb-flop-pressure"} />;
}
