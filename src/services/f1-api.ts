/**
 * F1 API Service — fetches data from f1api.dev
 * and transforms it into our app's domain types.
 */

const BASE = "https://f1api.dev/api";

// ── Team color map (API doesn't provide colors) ──────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  mercedes: "#27F4D2",
  aston_martin: "#358C75",
  alpine: "#2293D1",
  williams: "#37BEDD",
  haas: "#B6BABD",
  kick_sauber: "#52E252",
  sauber: "#52E252",
  racing_bulls: "#6692FF",
  rb: "#6692FF",
  alfa_romeo: "#C92D4B",
};

function teamColor(teamId: string): string {
  return TEAM_COLORS[teamId] ?? "#888888";
}

function driverShortId(shortName: string): string {
  return shortName?.toLowerCase() ?? "";
}

// ── Generic fetch helper ─────────────────────────────────────────────────────
async function apiFetch<T>(path: string, limit = 30): Promise<T> {
  const url = `${BASE}${path}?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`F1 API ${res.status}: ${url}`);
  return res.json();
}

// ── Types matching API responses ─────────────────────────────────────────────

interface APIDriverStanding {
  driverId: string;
  teamId: string;
  points: number;
  position: number;
  wins: number;
  driver: {
    name: string;
    surname: string;
    nationality: string;
    number: number;
    shortName: string;
  };
  team: {
    teamId: string;
    teamName: string;
  };
}

interface APIConstructorStanding {
  teamId: string;
  points: number;
  position: number;
  wins: number;
  team: {
    teamName: string;
    country: string;
  };
}

interface APIRaceResult {
  position: number;
  points: number;
  grid: number;
  time: string | null;
  fastLap: string | null;
  retired: string | null;
  driver: {
    driverId: string;
    name: string;
    surname: string;
    shortName: string;
    number: number;
    nationality: string;
  };
  team: {
    teamId: string;
    teamName: string;
  };
}

interface APIRace {
  round: string;
  date: string;
  raceName: string;
  raceId: string;
  circuit: {
    circuitId: string;
    circuitName: string;
    country: string;
    city: string;
    circuitLength: string;
    lapRecord: string;
    corners: number;
  };
  results?: APIRaceResult[];
}

// ── Import our domain types ──────────────────────────────────────────────────
import type { Driver, Team, Circuit, RaceResult, SeasonData } from "@/data/f1-data";

// ── Fetchers + transformers ──────────────────────────────────────────────────

export async function fetchDriverStandings(year: number): Promise<Driver[]> {
  const data = await apiFetch<{ drivers_championship: APIDriverStanding[] }>(
    `/${year}/drivers-championship`,
    30
  );
  return (data.drivers_championship ?? []).map((d) => ({
    id: driverShortId(d.driver.shortName),
    name: `${d.driver.name} ${d.driver.surname}`,
    team: d.team.teamName,
    teamColor: teamColor(d.teamId),
    number: d.driver.number,
    nationality: d.driver.nationality?.substring(0, 3).toUpperCase() ?? "",
    points: d.points,
    wins: d.wins,
    podiums: 0, // API doesn't provide podiums directly
    bestLap: "-",
  }));
}

export async function fetchConstructorStandings(year: number): Promise<Team[]> {
  const data = await apiFetch<{ constructors_championship: APIConstructorStanding[] }>(
    `/${year}/constructors-championship`,
    30
  );
  return (data.constructors_championship ?? []).map((c) => ({
    id: c.teamId,
    name: c.team.teamName,
    color: teamColor(c.teamId),
    points: c.points,
    wins: c.wins,
    podiums: 0,
    drivers: [],
    avgFinish: 0,
  }));
}

export async function fetchRaces(year: number): Promise<APIRace[]> {
  const data = await apiFetch<{ races: APIRace[] }>(`/${year}`, 50);
  return data.races ?? [];
}

export async function fetchRaceResults(year: number, round: number): Promise<APIRace | null> {
  try {
    const data = await apiFetch<{ races: APIRace }>(`/${year}/${round}/race`, 30);
    return data.races ?? null;
  } catch {
    return null;
  }
}

// ── Full season assembler ────────────────────────────────────────────────────

export async function fetchSeasonData(year: number): Promise<SeasonData> {
  // Fetch standings + races list in parallel
  const [drivers, teams, races] = await Promise.all([
    fetchDriverStandings(year),
    fetchConstructorStandings(year),
    fetchRaces(year),
  ]);

  // Enrich teams with driver names from standings
  const enrichedTeams = teams.map((team) => {
    const teamDrivers = drivers.filter(
      (d) => d.team === team.name
    );
    return {
      ...team,
      drivers: teamDrivers.map((d) => d.name),
    };
  });

  // Build circuits from races
  const circuits: Circuit[] = races.map((r) => ({
    id: r.circuit.circuitId,
    name: r.raceName.replace(/\d{4}$/, "").trim(),
    country: r.circuit.country,
    laps: 0,
    length: r.circuit.circuitLength || "-",
    fastestLap: r.circuit.lapRecord || "-",
    sectors: [],
  }));

  // Fetch race results (first 10 rounds in parallel for performance)
  const maxRounds = Math.min(races.length, 24);
  const roundNumbers = Array.from({ length: maxRounds }, (_, i) => i + 1);

  const raceResultsRaw = await Promise.all(
    roundNumbers.map((round) => fetchRaceResults(year, round))
  );

  // Transform race results
  const results: RaceResult[] = [];
  const pointsMap: Record<string, Record<string, number>> = {};

  raceResultsRaw.forEach((race, idx) => {
    if (!race?.results) return;
    const raceName = race.raceName?.replace(/\d{4}$/, "").trim() ?? `Round ${idx + 1}`;
    const raceShort = race.circuit?.circuitId?.substring(0, 3).toUpperCase() ?? `R${idx + 1}`;

    race.results.forEach((r) => {
      const driverName = `${r.driver.name} ${r.driver.surname}`;
      const driverId = driverShortId(r.driver.shortName);

      results.push({
        circuit: raceName,
        driver: driverName,
        position: r.position,
        points: r.points,
        fastestLap: r.fastLap ?? r.time ?? "-",
        gap: r.position === 1 ? "-" : r.time ?? (r.retired ? "DNF" : "-"),
      });

      // Build points progression
      if (!pointsMap[driverId]) pointsMap[driverId] = {};
      const prevRaces = Object.keys(pointsMap[driverId]);
      const lastTotal =
        prevRaces.length > 0
          ? (pointsMap[driverId][prevRaces[prevRaces.length - 1]] ?? 0)
          : 0;
      pointsMap[driverId][raceShort] = lastTotal + r.points;
    });
  });

  // Build points progression array
  const allRaceKeys = [
    ...new Set(
      raceResultsRaw
        .filter(Boolean)
        .map((r, idx) =>
          r!.circuit?.circuitId?.substring(0, 3).toUpperCase() ?? `R${idx + 1}`
        )
    ),
  ];

  const topDriverIds = drivers.slice(0, 8).map((d) => d.id);
  const pointsProgression: { race: string; [driver: string]: number | string }[] = allRaceKeys.map((raceKey) => {
    const row: { race: string; [driver: string]: number | string } = { race: raceKey };
    topDriverIds.forEach((dId) => {
      row[dId] = pointsMap[dId]?.[raceKey] ?? 0;
    });
    return row;
  });

  return {
    year,
    drivers,
    circuits,
    results,
    teams: enrichedTeams,
    pointsProgression,
    raceLaps: [], // Lap-by-lap data not available from this API
  };
}

// ── Available seasons ────────────────────────────────────────────────────────
export const API_SEASONS = [2025, 2024, 2023, 2022, 2021, 2020];
