import { useQuery } from "@tanstack/react-query";

import { trainingSpots } from "@/src/mocks/spots";

export const useTrainingSpots = () =>
  useQuery({
    queryKey: ["training-spots"],
    queryFn: async () => trainingSpots,
    staleTime: Infinity,
  });
