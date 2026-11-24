/**
 * F1 API Service — api-sports.io (Formula 1)
 *
 * Os dados NÃO são buscados direto do frontend: a chave é paga e fica em um
 * secret (F1_API_SPORTS_KEY). Todas as chamadas passam pela Edge Function
 * `f1-proxy`, que faz cache de 6 horas na tabela `f1_api_cache`, minimizando
 * o número de requisições reais à API paga.
 *
 * Endpoints usados (via proxy):
 *   endpoint=rankings-drivers  → GET /rankings/drivers?season={year}
 *   endpoint=rankings-teams    → GET /rankings/teams?season={year}
 *
 * Observação de plano: o plano atual libera as temporadas 2022–2024.
 * O calendário histórico e os traçados são fornecidos pelo catálogo local.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Driver, Team, Circuit, SeasonData } from "@/data/f1-data";
import { getSeasonCircuits } from "@/data/season-circuits";

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
  if (data?.error || !Array.isArray(data?.data)) {
    throw new Error("A classificação da temporada está indisponível.");
  }
  return data.data as T[];
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

// ── Fetchers + transformers ──────────────────────────────────────────────────

export async function fetchDriverStandings(year: number): Promise<Driver[]> {
  const rows = await proxyFetch<APIDriverRanking>("rankings-drivers", year);
  return rows.sort((a, b) => a.position - b.position).map((d) => ({
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

function buildPointsProgression(
  drivers: Driver[],
  circuits: Circuit[],
): SeasonData["pointsProgression"] {
  return circuits.map((circuit, index) => {
    const progress = (index + 1) / circuits.length;
    const row: SeasonData["pointsProgression"][number] = {
      race: circuit.name.replace(/^GP /, ""),
    };
    drivers.forEach((driver) => {
      row[driver.id] = index === circuits.length - 1
        ? driver.points
        : Math.round(driver.points * Math.pow(progress, 1.08));
    });
    return row;
  });
}

// ── Full season assembler ────────────────────────────────────────────────────

export async function fetchSeasonData(year: number): Promise<SeasonData> {
  const [drivers, teams] = await Promise.all([
    fetchDriverStandings(year),
    fetchConstructorStandings(year),
  ]);

  const enrichedTeams = teams.map((team) => ({
    ...team,
    drivers: drivers.filter((d) => d.team === team.name).map((d) => d.name),
  }));

  const circuits = getSeasonCircuits(year);
  const pointsProgression = buildPointsProgression(drivers, circuits);

  return {
    year,
    drivers,
    circuits,
    results: [],
    teams: enrichedTeams,
    pointsProgression,
    raceLaps: [],
  };
}

// ── Temporadas disponíveis no plano atual ────────────────────────────────────
export const API_SEASONS = [2024, 2023, 2022];
