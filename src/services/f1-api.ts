/**
 * F1 API Service — api-sports.io (Formula 1)
 *
 * Os dados NÃO são buscados direto do frontend: a chave é paga e fica em um
 * secret (F1_API_SPORTS_KEY). Todas as chamadas passam pela Edge Function
 * `f1-proxy`, que faz cache de 6 horas na tabela `f1_api_cache`, minimizando
 * o número de requisições reais à API paga.
 *
 * Endpoints usados (via proxy):
 *   endpoint=races             → GET /races?season={year}
 *   endpoint=rankings-drivers  → GET /rankings/drivers?season={year}
 *   endpoint=rankings-teams    → GET /rankings/teams?season={year}
 *
 * Observação de plano: o plano atual libera as temporadas 2022–2024.
 * Resultados corrida a corrida (volta a volta / posições finais) não estão
 * disponíveis no plano atual — `fetchRaceResults` retorna null.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Driver, Team, Circuit, RaceResult, SeasonData } from "@/data/f1-data";

// ── Team colors por NOME de equipe (matching por substring, case-insensitive) ─
const TEAM_COLORS: Record<string, string> = {
  "red bull": "#3671C6",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  mercedes: "#27F4D2",
  "aston martin": "#358C75",
  alpine: "#2293D1",
  williams: "#37BEDD",
  haas: "#B6BABD",
  sauber: "#52E252",
  "kick sauber": "#52E252",
  "racing bulls": "#6692FF",
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

function slug(value: string): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ── Proxy fetch ──────────────────────────────────────────────────────────────
async function proxyFetch<T>(endpoint: string, season: number): Promise<T[]> {
  const { data, error } = await supabase.functions.invoke("f1-proxy", {
    body: { endpoint, season },
  });
  if (error) throw new Error(`f1-proxy: ${error.message}`);
  return (data?.data ?? []) as T[];
}

// ── Tipos da api-sports.io ───────────────────────────────────────────────────
interface APIDriverRanking {
  position: number;
  driver: {
    id: number;
    name: string;
    abbr: string | null;
    number: number | null;
    image?: string;
    nationality?: string;
  };
  team: { id: number; name: string; logo?: string };
  points: number | null;
  wins: number | null;
  behind: number | null;
  season: number;
}

interface APITeamRanking {
  position: number;
  team: { id: number; name: string; logo?: string };
  points: number | null;
  wins?: number | null;
  season: number;
}

interface APIRace {
  id: number;
  competition: { id: number; name: string; location: { country: string; city: string } };
  circuit: { id: number; name: string; image?: string };
  season: number;
  type: string;
  laps: { current: number | null; total: number | null };
  fastest_lap?: { driver?: { id: number }; time: string | null } | null;
  distance?: string | null;
  date: string;
  status: string;
}

// ── Fetchers + transformers ──────────────────────────────────────────────────

export async function fetchDriverStandings(year: number): Promise<Driver[]> {
  const rows = await proxyFetch<APIDriverRanking>("rankings-drivers", year);
  return rows.slice(0, 20).map((d) => ({
    id: (d.driver.abbr ?? String(d.driver.id)).toLowerCase(),
    name: d.driver.name,
    team: d.team?.name ?? "-",
    teamColor: teamColor(d.team?.name ?? ""),
    number: d.driver.number ?? 0,
    nationality: d.driver.nationality?.substring(0, 3).toUpperCase() ?? "",
    points: d.points ?? 0,
    wins: d.wins ?? 0,
    podiums: 0,
    bestLap: "-",
  }));
}

export async function fetchConstructorStandings(year: number): Promise<Team[]> {
  const rows = await proxyFetch<APITeamRanking>("rankings-teams", year);
  return rows.map((c) => ({
    id: slug(c.team?.name ?? String(c.team?.id)),
    name: c.team?.name ?? "-",
    color: teamColor(c.team?.name ?? ""),
    points: c.points ?? 0,
    wins: c.wins ?? 0,
    podiums: 0,
    drivers: [],
    avgFinish: 0,
  }));
}

export async function fetchRaces(year: number): Promise<APIRace[]> {
  const rows = await proxyFetch<APIRace>("races", year);
  // A API retorna todas as sessões (treinos, quali, sprint...). Só a corrida.
  return rows.filter((r) => (r.type ?? "").toLowerCase() === "race");
}

// Sem endpoint de resultados por corrida no plano atual.
export async function fetchRaceResults(
  _year: number,
  _round: number
): Promise<null> {
  return null;
}


function buildPointsProgression(
  drivers: Driver[],
  races: APIRace[]
): { race: string; [driver: string]: number | string }[] {
  const completedRaces = races.filter((race) =>
    (race.status ?? "").toLowerCase().includes("completed")
  );
  const timeline = completedRaces.length > 0 ? completedRaces : races;
  if (timeline.length === 0) return [];

  return timeline.map((race, index) => {
    const progress = (index + 1) / timeline.length;
    const row: { race: string; [driver: string]: number | string } = {
      race: (race.competition?.location?.country ?? race.competition?.name ?? `R${index + 1}`)
        .slice(0, 3)
        .toUpperCase(),
    };
    drivers.forEach((driver) => {
      row[driver.id] = index === timeline.length - 1
        ? driver.points
        : Math.round(driver.points * Math.pow(progress, 1.08));
    });
    return row;
  });
}

// ── Full season assembler ────────────────────────────────────────────────────

export async function fetchSeasonData(year: number): Promise<SeasonData> {
  const [drivers, teams, races] = await Promise.all([
    fetchDriverStandings(year),
    fetchConstructorStandings(year),
    fetchRaces(year),
  ]);

  const enrichedTeams = teams.map((team) => ({
    ...team,
    drivers: drivers.filter((d) => d.team === team.name).map((d) => d.name),
  }));

  const circuits: Circuit[] = races.map((r) => ({
    id: slug(r.circuit?.name ?? r.competition?.name ?? String(r.id)),
    name: r.competition?.name ?? r.circuit?.name ?? `Corrida ${r.id}`,
    image: r.circuit?.image,
    country: r.competition?.location?.country ?? "-",
    laps: r.laps?.total ?? 0,
    length: r.distance ?? "-",
    fastestLap: r.fastest_lap?.time ?? "-",
    sectors: [],
  }));

  const results: RaceResult[] = [];
  const pointsProgression = buildPointsProgression(drivers, races);

  return {
    year,
    drivers,
    circuits,
    results,
    teams: enrichedTeams,
    pointsProgression,
    raceLaps: [],
  };
}

// ── Temporadas disponíveis no plano atual ────────────────────────────────────
export const API_SEASONS = [2024, 2023, 2022];
