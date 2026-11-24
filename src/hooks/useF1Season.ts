import { useQuery } from "@tanstack/react-query";
import { fetchSeasonData, API_SEASONS, latestSeasonSnapshot } from "@/services/f1-api";
import type { SeasonData } from "@/data/f1-data";

export function useF1Season(year: number) {
  return useQuery<SeasonData>({
    queryKey: ["f1-season", year],
    queryFn: ({ signal }) => fetchSeasonData(year, signal),
    placeholderData: year === latestSeasonSnapshot.year ? latestSeasonSnapshot : undefined,
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 1,
  });
}

export { API_SEASONS };
