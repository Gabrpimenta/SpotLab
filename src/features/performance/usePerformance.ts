import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPerformance,
  recordTrainingResult,
  resetProgress,
} from "@/src/services/performance/performance.service";

export const performanceQueryKey = ["performance"] as const;

export const usePerformance = () =>
  useQuery({ queryKey: performanceQueryKey, queryFn: getPerformance });

export const useRecordTrainingResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordTrainingResult,
    onSuccess: (summary) =>
      queryClient.setQueryData(performanceQueryKey, summary),
  });
};

export const useResetProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetProgress,
    onSuccess: (summary) =>
      queryClient.setQueryData(performanceQueryKey, summary),
  });
};
