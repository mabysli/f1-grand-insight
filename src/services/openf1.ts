const BASE = "https://api.openf1.org/v1";

export type OpenF1Session = { session_key: number; date_start: string };
type OpenF1Lap = { lap_number: number; lap_duration: number | null; is_pit_out_lap: boolean };

async function get<T>(endpoint: string, params: Record<string, string>, signal: AbortSignal): Promise<T[]> {
  const response = await fetch(`${BASE}/${endpoint}?${new URLSearchParams(params)}`, { signal });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`OpenF1: HTTP ${response.status}`);
  return response.json();
}

export function fetchRaceSessions(year: number, signal: AbortSignal) {
  return get<OpenF1Session>("sessions", { year: String(year), session_name: "Race" }, signal);
}

export async function fetchRacePace(sessionKey: number, driverNumber: number, signal: AbortSignal) {
  const laps = await get<OpenF1Lap>("laps", {
    session_key: String(sessionKey), driver_number: String(driverNumber),
  }, signal);
  return laps
    .filter((lap) => !lap.is_pit_out_lap && lap.lap_number > 1 && lap.lap_duration > 0)
    .map((lap) => ({ lap: lap.lap_number, seconds: lap.lap_duration }))
    .sort((a, b) => a.lap - b.lap);
}
