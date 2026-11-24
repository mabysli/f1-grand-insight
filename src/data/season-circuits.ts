import type { Circuit } from "./f1-data";
import maps from "./circuit-maps.json";
import calendars from "./race-calendar.json";

type Track = { name: string; country: string; lengthKm: number; path: string };
type Race = { id: string; name: string; laps: number; fastestLap?: string };

const tracks: Record<string, Track> = maps;
const seasons: Record<number, Race[]> = calendars;
const lengthFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function getSeasonCircuits(year: number): Circuit[] {
  return (seasons[year] ?? []).map((race) => {
    const track = tracks[`${race.id}_${year}`] ?? tracks[race.id];
    return {
      id: race.id,
      name: race.name,
      laps: race.laps,
      trackName: track.name,
      trackPath: track.path,
      country: track.country,
      lengthKm: track.lengthKm,
      length: `${lengthFormat.format(track.lengthKm)} km`,
      fastestLap: race.fastestLap ?? "-",
      sectors: [],
    };
  });
}
