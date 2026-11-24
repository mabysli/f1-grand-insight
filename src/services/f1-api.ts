import type { Circuit, SeasonData } from "@/data/f1-data";
import { getCircuitTrack, getSeasonCircuits } from "@/data/season-circuits";
import snapshot from "@/data/season-snapshot-2026.json";

export const latestSeasonSnapshot: SeasonData = {
  ...snapshot,
  circuits: snapshot.circuits.map((circuit) => ({
    ...circuit,
    trackPath: getCircuitTrack(circuit.id, snapshot.year)?.path,
  })),
};

const TEAM_COLORS: Record<string, string> = {
  "racing bulls": "#6692FF",
  "red bull": "#3671C6",
  audi: "#F04C53",
  cadillac: "#B6A172",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  mercedes: "#27F4D2",
  "aston martin": "#358C75",
  alpine: "#2293D1",
  williams: "#37BEDD",
  haas: "#B6BABD",
  sauber: "#52E252",
  "kick sauber": "#52E252",
  alphatauri: "#6692FF",
  "visa cash app": "#6692FF",
  "alfa romeo": "#C92D4B",
};

function teamColor(teamName: string): string {
  const n = (teamName ?? "").toLowerCase();
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (n.includes(key)) return color;
  }
  return "#888888";
}

const BASE = "https://api.jolpi.ca/ergast/f1";
const PAGE_SIZE = 100;
export const API_SEASONS = [2026, 2025, 2024, 2023, 2022];

type Person = { driverId: string; givenName: string; familyName: string; permanentNumber?: string; nationality: string };
type Constructor = { constructorId: string; name: string };
type Result = {
  number: string; points: string; laps: string; position: string; positionText: string;
  Driver: Person; Constructor: Constructor;
  FastestLap?: { rank: string; Time: { time: string } };
};
type Race = {
  round: string; raceName: string; date: string;
  Circuit: { circuitId: string; circuitName: string; Location: { country: string } };
  Results?: Result[]; SprintResults?: Result[];
};
type DriverStanding = { points: string; wins: string; Driver: Person; Constructors: Constructor[] };
type TeamStanding = { points: string; wins: string; Constructor: Constructor };
type Standings = { round: string; DriverStandings?: DriverStanding[]; ConstructorStandings?: TeamStanding[] };
type Payload = { total: string; RaceTable?: { Races: Race[] }; StandingsTable?: { StandingsLists: Standings[] } };

async function fetchPage(year: number, endpoint: string, signal: AbortSignal, offset = 0): Promise<Payload> {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (offset) query.set("offset", String(offset));
  const url = `${BASE}/${year}/${endpoint}.json`;
  const suffix = endpoint.endsWith("standings") ? "" : `?${query}`;
  let response = await fetch(url + suffix, { signal });
  if (response.status === 429 || response.status >= 500) {
    const delay = response.status === 429 ? 1800 : 700;
    await new Promise((resolve) => setTimeout(resolve, delay));
    response = await fetch(url.replace(/\.json$/, "/") + suffix, { signal });
  }
  if (!response.ok) throw new Error(`Jolpica: HTTP ${response.status}`);
  const result = await response.json();
  if (!result.MRData) throw new Error("Resposta inválida da Jolpica.");
  return result.MRData;
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 350));

async function fetchResults(year: number, endpoint: "results" | "sprint", signal: AbortSignal) {
  const rounds = new Map<string, Result[]>();
  for (let offset = 0, total = 1; offset < total; offset += PAGE_SIZE) {
    await pause();
    const page = await fetchPage(year, endpoint, signal, offset);
    total = Number(page.total);

    for (const race of page.RaceTable?.Races ?? []) {
      const results = endpoint === "sprint" ? race.SprintResults : race.Results;
      rounds.set(race.round, [...(rounds.get(race.round) ?? []), ...(results ?? [])]);
    }
  }
  return rounds;
}

function lapSeconds(time: string) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

function personName(person: Person) {
  return `${person.givenName} ${person.familyName}`;
}

async function fetchLiveSeason(year: number, signal: AbortSignal): Promise<SeasonData> {
  const [calendar, driverPage, teamPage] = await Promise.all([
    fetchPage(year, "races", signal),
    fetchPage(year, "driverstandings", signal),
    fetchPage(year, "constructorstandings", signal),
  ]);
  let detailedResults = true;
  let raceResults = new Map<string, Result[]>();
  let sprintResults = new Map<string, Result[]>();
  try {
    raceResults = await fetchResults(year, "results", signal);
    sprintResults = await fetchResults(year, "sprint", signal);
  } catch (error) {
    if (signal.aborted) throw error;
    detailedResults = false;
    if (!raceResults.size) {
      const last = await fetchPage(year, "last/results", signal).catch(() => null);
      for (const race of last?.RaceTable?.Races ?? []) raceResults.set(race.round, race.Results ?? []);
    }
  }
  const completedRound = Number(driverPage.StandingsTable?.StandingsLists[0]?.round ?? 0);
  const races = calendar.RaceTable?.Races ?? [];
  const localCircuits = new Map(getSeasonCircuits(year).map((circuit) => [circuit.id, circuit]));
  const referenceCircuits = new Map([2022, 2023, 2024].flatMap(getSeasonCircuits).map((circuit) => [circuit.id, circuit]));
  const totals: Record<string, number> = {};
  const allResults = [...raceResults.values()].flat();
  const pointsProgression: SeasonData["pointsProgression"] = [];

  const circuits: Circuit[] = races.map((race) => {
    const id = race.Circuit.circuitId;
    const local = localCircuits.get(id) ?? referenceCircuits.get(id);
    const track = getCircuitTrack(id, year);
    const results = raceResults.get(race.round) ?? [];
    const sprint = sprintResults.get(race.round) ?? [];
    const winner = results.find((result) => result.positionText === "1");
    const fastest = results.find((result) => result.FastestLap?.rank === "1");
    if (detailedResults && (results.length || sprint.length)) {
      for (const result of [...sprint, ...results]) {
        const driverId = result.Driver.driverId;
        totals[driverId] = (totals[driverId] ?? 0) + Number(result.points);
      }
      pointsProgression.push({ ...totals, race: race.raceName, round: Number(race.round) });
    }
    return {
      id,
      name: year === 2026 && id === "catalunya" ? "GP Barcelona-Catalunha" : local?.name ?? race.raceName,
      trackName: race.Circuit.circuitName,
      trackPath: track?.path,
      country: track?.country ?? race.Circuit.Location.country,
      laps: Number(winner?.laps ?? localCircuits.get(id)?.laps ?? 0),
      completed: Number(race.round) <= completedRound,
      length: track?.length ?? "—",
      lengthKm: track?.lengthKm,
      fastestLap: fastest?.FastestLap?.Time.time ?? localCircuits.get(id)?.fastestLap ?? "-",
      sectors: [],
      date: race.date,
      winnerNumber: winner ? Number(winner.number) : undefined,
    };
  });

  const drivers = (driverPage.StandingsTable?.StandingsLists[0]?.DriverStandings ?? []).map((row) => {
    const results = allResults.filter((result) => result.Driver.driverId === row.Driver.driverId);
    const lastResult = results[results.length - 1];
    const team = lastResult?.Constructor.name ?? row.Constructors[row.Constructors.length - 1]?.name ?? "—";
    const laps = results.flatMap((result) => result.FastestLap?.Time.time ?? []).sort((a, b) => lapSeconds(a) - lapSeconds(b));
    return {
      id: row.Driver.driverId, name: personName(row.Driver), team, teamColor: teamColor(team),
      points: Number(row.points), wins: Number(row.wins),
      number: Number(lastResult?.number ?? row.Driver.permanentNumber ?? 0),
      nationality: row.Driver.nationality,
      podiums: results.filter((result) => ["1", "2", "3"].includes(result.positionText)).length,
      bestLap: laps[0] ?? "-",
    };
  });

  for (const row of pointsProgression) {
    for (const driver of drivers) row[driver.id] ??= 0;
  }

  const teams = (teamPage.StandingsTable?.StandingsLists[0]?.ConstructorStandings ?? []).map((row) => {
    const results = allResults.filter((result) => result.Constructor.constructorId === row.Constructor.constructorId);
    const classified = results.filter((result) => /^\d+$/.test(result.positionText));
    return {
      id: row.Constructor.constructorId, name: row.Constructor.name, color: teamColor(row.Constructor.name),
      points: Number(row.points), wins: Number(row.wins),
      podiums: results.filter((result) => ["1", "2", "3"].includes(result.positionText)).length,
      drivers: [...new Set(results.map((result) => personName(result.Driver)))],
      avgFinish: classified.length
        ? Number((classified.reduce((sum, result) => sum + Number(result.position), 0) / classified.length).toFixed(1))
        : 0,
    };
  });

  return { year, drivers, teams, circuits, pointsProgression, detailedResults, results: [], raceLaps: [] };
}

export async function fetchSeasonData(year: number, signal: AbortSignal): Promise<SeasonData> {
  const backup = year === latestSeasonSnapshot.year ? latestSeasonSnapshot : undefined;
  try {
    const live = await fetchLiveSeason(year, signal);
    const completed = (data: SeasonData) => data.circuits.filter((circuit) => circuit.completed).length;
    if (backup && (!live.drivers.length || !live.teams.length || !live.circuits.length ||
      (!live.detailedResults && completed(live) <= completed(backup)))) {
      return backup;
    }
    return live;
  } catch (error) {
    if (backup && !signal.aborted) return backup;
    throw error;
  }
}
