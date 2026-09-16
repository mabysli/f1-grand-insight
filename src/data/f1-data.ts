export interface Driver {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  number: number;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  bestLap: string;
}

export interface SectorTime {
  sector: number;
  time: string;
  driver: string;
}

export interface Circuit {
  id: string;
  name: string;
  image?: string;
  country: string;
  laps: number;
  length: string;
  fastestLap: string;
  sectors: SectorTime[];
}

export interface Team {
  id: string;
  name: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
  drivers: string[];
  avgFinish: number;
}

export interface RaceResult {
  circuit: string;
  driver: string;
  position: number;
  points: number;
  fastestLap: string;
  gap: string;
}

export interface SeasonData {
  year: number;
  drivers: Driver[];
  circuits: Circuit[];
  results: RaceResult[];
  teams: Team[];
  pointsProgression: { race: string; [driver: string]: number | string }[];
  raceLaps: RaceLapData[];
}

// ── Race Position (lap-by-lap) types ──────────────────────────────────────────

export type LapEvent = "pit" | "dnf" | "accident";

export interface LapPoint {
  lap: number;
  position: number;
  lapTime: string;
  event?: LapEvent;
}

export interface DriverLapData {
  driverId: string;
  laps: LapPoint[];
}

export interface RaceLapData {
  circuitId: string;
  circuitName: string;
  totalLaps: number;
  drivers: DriverLapData[];
}


const drivers2024: Driver[] = [
  { id: "ver", name: "Max Verstappen", team: "Red Bull Racing", teamColor: "#3671C6", number: 1, nationality: "NED", points: 437, wins: 9, podiums: 14, bestLap: "1:24.319" },
  { id: "nor", name: "Lando Norris", team: "McLaren", teamColor: "#FF8000", number: 4, nationality: "GBR", points: 374, wins: 4, podiums: 15, bestLap: "1:24.542" },
  { id: "lec", name: "Charles Leclerc", team: "Ferrari", teamColor: "#E8002D", number: 16, nationality: "MON", points: 356, wins: 3, podiums: 13, bestLap: "1:24.678" },
  { id: "pia", name: "Oscar Piastri", team: "McLaren", teamColor: "#FF8000", number: 81, nationality: "AUS", points: 292, wins: 2, podiums: 9, bestLap: "1:24.890" },
  { id: "sai", name: "Carlos Sainz", team: "Ferrari", teamColor: "#E8002D", number: 55, nationality: "ESP", points: 290, wins: 2, podiums: 10, bestLap: "1:24.912" },
  { id: "ham", name: "Lewis Hamilton", team: "Mercedes", teamColor: "#27F4D2", number: 44, nationality: "GBR", points: 211, wins: 2, podiums: 5, bestLap: "1:25.102" },
  { id: "rus", name: "George Russell", team: "Mercedes", teamColor: "#27F4D2", number: 63, nationality: "GBR", points: 217, wins: 2, podiums: 7, bestLap: "1:25.034" },
  { id: "per", name: "Sergio Pérez", team: "Red Bull Racing", teamColor: "#3671C6", number: 11, nationality: "MEX", points: 152, wins: 0, podiums: 3, bestLap: "1:25.456" },
];

const circuits2024: Circuit[] = [
  { id: "bah", name: "Bahrain GP", country: "Bahrain", laps: 57, length: "5.412 km", fastestLap: "1:31.447", sectors: [{ sector: 1, time: "0:28.523", driver: "Max Verstappen" }, { sector: 2, time: "0:35.412", driver: "Charles Leclerc" }, { sector: 3, time: "0:27.512", driver: "Max Verstappen" }] },
  { id: "jed", name: "Saudi Arabian GP", country: "Arábia Saudita", laps: 50, length: "6.174 km", fastestLap: "1:27.472", sectors: [{ sector: 1, time: "0:25.102", driver: "Max Verstappen" }, { sector: 2, time: "0:34.890", driver: "Lando Norris" }, { sector: 3, time: "0:27.480", driver: "Max Verstappen" }] },
  { id: "mel", name: "Australian GP", country: "Austrália", laps: 58, length: "5.278 km", fastestLap: "1:19.813", sectors: [{ sector: 1, time: "0:24.312", driver: "Carlos Sainz" }, { sector: 2, time: "0:29.456", driver: "Charles Leclerc" }, { sector: 3, time: "0:26.045", driver: "Carlos Sainz" }] },
  { id: "suz", name: "Japanese GP", country: "Japão", laps: 53, length: "5.807 km", fastestLap: "1:30.983", sectors: [{ sector: 1, time: "0:29.234", driver: "Max Verstappen" }, { sector: 2, time: "0:40.112", driver: "Max Verstappen" }, { sector: 3, time: "0:21.637", driver: "Lando Norris" }] },
  { id: "sha", name: "Chinese GP", country: "China", laps: 56, length: "5.451 km", fastestLap: "1:33.584", sectors: [{ sector: 1, time: "0:30.456", driver: "Max Verstappen" }, { sector: 2, time: "0:36.234", driver: "Charles Leclerc" }, { sector: 3, time: "0:26.894", driver: "Lando Norris" }] },
  { id: "mia", name: "Miami GP", country: "EUA", laps: 57, length: "5.412 km", fastestLap: "1:29.708", sectors: [{ sector: 1, time: "0:27.345", driver: "Lando Norris" }, { sector: 2, time: "0:35.678", driver: "Max Verstappen" }, { sector: 3, time: "0:26.685", driver: "Lando Norris" }] },
  { id: "imo", name: "Emilia Romagna GP", country: "Itália", laps: 63, length: "4.909 km", fastestLap: "1:15.203", sectors: [{ sector: 1, time: "0:23.456", driver: "Max Verstappen" }, { sector: 2, time: "0:28.912", driver: "Oscar Piastri" }, { sector: 3, time: "0:22.835", driver: "Max Verstappen" }] },
  { id: "mon", name: "Monaco GP", country: "Mônaco", laps: 78, length: "3.337 km", fastestLap: "1:12.143", sectors: [{ sector: 1, time: "0:19.234", driver: "Charles Leclerc" }, { sector: 2, time: "0:32.456", driver: "Charles Leclerc" }, { sector: 3, time: "0:20.453", driver: "Carlos Sainz" }] },
  { id: "bar", name: "Spanish GP", country: "Espanha", laps: 66, length: "4.657 km", fastestLap: "1:13.704", sectors: [{ sector: 1, time: "0:22.345", driver: "Lando Norris" }, { sector: 2, time: "0:28.912", driver: "Max Verstappen" }, { sector: 3, time: "0:22.447", driver: "Lando Norris" }] },
  { id: "sil", name: "British GP", country: "Reino Unido", laps: 52, length: "5.891 km", fastestLap: "1:28.473", sectors: [{ sector: 1, time: "0:28.123", driver: "Lewis Hamilton" }, { sector: 2, time: "0:35.678", driver: "Lewis Hamilton" }, { sector: 3, time: "0:24.672", driver: "Max Verstappen" }] },
];

const teams2024: Team[] = [
  { id: "redbull", name: "Red Bull Racing", color: "#3671C6", points: 589, wins: 9, podiums: 17, drivers: ["Max Verstappen", "Sergio Pérez"], avgFinish: 2.8 },
  { id: "mclaren", name: "McLaren", color: "#FF8000", points: 666, wins: 6, podiums: 24, drivers: ["Lando Norris", "Oscar Piastri"], avgFinish: 3.1 },
  { id: "ferrari", name: "Ferrari", color: "#E8002D", points: 646, wins: 5, podiums: 23, drivers: ["Charles Leclerc", "Carlos Sainz"], avgFinish: 3.4 },
  { id: "mercedes", name: "Mercedes", color: "#27F4D2", points: 428, wins: 4, podiums: 12, drivers: ["Lewis Hamilton", "George Russell"], avgFinish: 4.6 },
];

const pointsProgression2024 = [
  { race: "BAH", ver: 25, nor: 8, lec: 18, pia: 6, sai: 15, ham: 4, rus: 10, per: 12 },
  { race: "SAU", ver: 50, nor: 16, lec: 30, pia: 18, sai: 33, ham: 8, rus: 22, per: 30 },
  { race: "AUS", ver: 75, nor: 26, lec: 48, pia: 34, sai: 48, ham: 12, rus: 34, per: 42 },
  { race: "JPN", ver: 100, nor: 44, lec: 63, pia: 46, sai: 60, ham: 24, rus: 46, per: 52 },
  { race: "CHN", ver: 136, nor: 62, lec: 81, pia: 58, sai: 72, ham: 36, rus: 58, per: 62 },
  { race: "MIA", ver: 161, nor: 88, lec: 96, pia: 76, sai: 87, ham: 48, rus: 72, per: 70 },
  { race: "EMI", ver: 186, nor: 120, lec: 114, pia: 94, sai: 102, ham: 60, rus: 84, per: 78 },
  { race: "MON", ver: 204, nor: 148, lec: 139, pia: 112, sai: 120, ham: 72, rus: 96, per: 82 },
  { race: "ESP", ver: 229, nor: 176, lec: 157, pia: 136, sai: 138, ham: 92, rus: 110, per: 88 },
  { race: "GBR", ver: 254, nor: 210, lec: 178, pia: 154, sai: 155, ham: 117, rus: 128, per: 92 },
];

const results2024: RaceResult[] = [
  { circuit: "Bahrain GP", driver: "Max Verstappen", position: 1, points: 25, fastestLap: "1:32.608", gap: "-" },
  { circuit: "Bahrain GP", driver: "Charles Leclerc", position: 2, points: 18, fastestLap: "1:32.886", gap: "+22.457" },
  { circuit: "Bahrain GP", driver: "Carlos Sainz", position: 3, points: 15, fastestLap: "1:33.012", gap: "+25.110" },
  { circuit: "Saudi Arabian GP", driver: "Max Verstappen", position: 1, points: 25, fastestLap: "1:27.847", gap: "-" },
  { circuit: "Saudi Arabian GP", driver: "Sergio Pérez", position: 2, points: 18, fastestLap: "1:28.123", gap: "+13.643" },
  { circuit: "Saudi Arabian GP", driver: "Charles Leclerc", position: 3, points: 12, fastestLap: "1:28.456", gap: "+18.639" },
  { circuit: "Australian GP", driver: "Carlos Sainz", position: 1, points: 25, fastestLap: "1:20.235", gap: "-" },
  { circuit: "Australian GP", driver: "Charles Leclerc", position: 2, points: 18, fastestLap: "1:20.456", gap: "+2.366" },
  { circuit: "Australian GP", driver: "Lando Norris", position: 3, points: 15, fastestLap: "1:20.678", gap: "+5.134" },
  { circuit: "British GP", driver: "Lewis Hamilton", position: 1, points: 25, fastestLap: "1:28.893", gap: "-" },
  { circuit: "British GP", driver: "Max Verstappen", position: 2, points: 18, fastestLap: "1:29.012", gap: "+1.465" },
  { circuit: "British GP", driver: "Lando Norris", position: 3, points: 15, fastestLap: "1:29.234", gap: "+7.547" },
];

// ── Lap-by-lap data ───────────────────────────────────────────────────────────

// Helper: build a lap array. pos[] length = total laps, events keyed by lap number
function makeLaps(
  positions: number[],
  lapTimes: string[],
  events: Record<number, LapEvent> = {}
): LapPoint[] {
  return positions.map((position, i) => ({
    lap: i + 1,
    position,
    lapTime: lapTimes[i] ?? "1:30.000",
    ...(events[i + 1] ? { event: events[i + 1] } : {}),
  }));
}

const bahrain2024Laps: RaceLapData = {
  circuitId: "bah",
  circuitName: "Bahrain GP",
  totalLaps: 30,
  drivers: [
    {
      driverId: "ver",
      laps: makeLaps(
        [1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ["1:34.1","1:33.4","1:33.2","1:33.0","1:32.9","1:32.8","1:32.9","1:37.2","1:32.6","1:32.3","1:32.1","1:32.0","1:31.9","1:31.8","1:31.7","1:31.9","1:31.8","1:31.7","1:31.6","1:31.5","1:31.4","1:31.6","1:31.5","1:31.4","1:31.3","1:31.4","1:31.5","1:31.4","1:31.3","1:31.2"],
        { 8: "pit" }
      ),
    },
    {
      driverId: "lec",
      laps: makeLaps(
        [2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ["1:34.4","1:33.6","1:33.4","1:33.2","1:33.1","1:33.0","1:33.1","1:33.0","1:37.5","1:32.8","1:32.6","1:32.5","1:32.4","1:32.3","1:32.2","1:32.4","1:32.3","1:32.2","1:32.1","1:32.0","1:31.9","1:32.1","1:32.0","1:31.9","1:31.8","1:31.9","1:32.0","1:31.9","1:31.8","1:31.7"],
        { 9: "pit" }
      ),
    },
    {
      driverId: "sai",
      laps: makeLaps(
        [3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        ["1:34.6","1:33.8","1:33.6","1:33.4","1:33.3","1:33.2","1:33.3","1:33.2","1:32.9","1:33.1","1:32.9","1:32.8","1:32.7","1:32.6","1:32.5","1:32.7","1:32.6","1:32.5","1:32.4","1:32.3","1:32.2","1:32.4","1:32.3","1:32.2","1:32.1","1:32.2","1:32.3","1:32.2","1:32.1","1:32.0"],
        {}
      ),
    },
    {
      driverId: "nor",
      laps: makeLaps(
        [4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        ["1:34.8","1:34.0","1:33.8","1:33.6","1:33.5","1:33.4","1:33.5","1:33.4","1:38.0","1:33.2","1:33.0","1:32.9","1:32.8","1:32.7","1:32.6","1:32.8","1:32.7","1:32.6","1:32.5","1:32.4","1:32.3","1:32.5","1:32.4","1:32.3","1:32.2","1:32.3","1:32.4","1:32.3","1:32.2","1:32.1"],
        { 8: "pit" }
      ),
    },
    {
      driverId: "pia",
      laps: makeLaps(
        [5,5,5,5,5,5,5,4,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        ["1:35.0","1:34.2","1:34.0","1:33.8","1:33.7","1:33.6","1:33.7","1:33.6","1:37.8","1:33.4","1:33.2","1:33.1","1:33.0","1:32.9","1:32.8","1:33.0","1:32.9","1:32.8","1:32.7","1:32.6","1:32.5","1:32.7","1:32.6","1:32.5","1:32.4","1:32.5","1:32.6","1:32.5","1:32.4","1:32.3"],
        { 8: "pit" }
      ),
    },
    {
      driverId: "ham",
      laps: makeLaps(
        [6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
        ["1:35.2","1:34.4","1:34.2","1:34.0","1:33.9","1:33.8","1:33.9","1:33.8","1:37.5","1:33.6","1:33.4","1:33.3","1:33.2","1:33.1","1:33.0","1:33.2","1:33.1","1:33.0","1:32.9","1:32.8","1:32.7","1:32.9","1:32.8","1:32.7","1:32.6","1:32.7","1:32.8","1:32.7","1:32.6","1:32.5"],
        { 9: "pit" }
      ),
    },
    {
      driverId: "rus",
      laps: makeLaps(
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        ["1:35.4","1:34.6","1:34.4","1:34.2","1:34.1","1:34.0","1:34.1","1:34.0","1:33.8","1:33.7","1:33.5","1:33.4","1:33.3","1:33.2","1:33.1","1:33.3","1:33.2","1:33.1","1:33.0","1:32.9","1:32.8","1:33.0","1:32.9","1:32.8","1:32.7","1:32.8","1:32.9","1:32.8","1:32.7","1:32.6"],
        {}
      ),
    },
    {
      driverId: "per",
      laps: makeLaps(
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
        ["1:35.6","1:34.8","1:34.6","1:34.4","1:34.3","1:34.2","1:34.3","1:34.2","1:34.0","1:33.9","1:33.7","1:33.6","1:33.5","1:33.4","1:33.3","1:33.5","1:33.4","1:33.3","1:33.2","1:33.1","1:33.0","1:33.2","1:33.1","1:33.0","1:32.9","1:33.0","1:33.1","1:33.0","1:32.9","1:32.8"],
        {}
      ),
    },
  ],
};

const british2024Laps: RaceLapData = {
  circuitId: "sil",
  circuitName: "British GP",
  totalLaps: 30,
  drivers: [
    {
      driverId: "ham",
      laps: makeLaps(
        [2,2,2,1,1,1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ["1:30.1","1:29.8","1:29.5","1:29.2","1:29.0","1:28.9","1:28.8","1:28.7","1:32.1","1:28.5","1:28.3","1:28.2","1:28.1","1:28.0","1:27.9","1:28.1","1:28.0","1:27.9","1:27.8","1:27.7","1:27.6","1:27.8","1:27.7","1:27.6","1:27.5","1:27.6","1:27.7","1:27.6","1:27.5","1:27.4"],
        { 4: "pit", 9: "pit" }
      ),
    },
    {
      driverId: "ver",
      laps: makeLaps(
        [1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ["1:29.9","1:29.6","1:29.3","1:29.2","1:29.1","1:29.0","1:28.9","1:28.8","1:28.7","1:28.6","1:28.4","1:28.3","1:28.2","1:28.1","1:28.0","1:28.2","1:28.1","1:28.0","1:27.9","1:27.8","1:27.7","1:27.9","1:27.8","1:27.7","1:27.6","1:27.7","1:27.8","1:27.7","1:27.6","1:27.5"],
        { 7: "pit" }
      ),
    },
    {
      driverId: "nor",
      laps: makeLaps(
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        ["1:30.3","1:30.0","1:29.7","1:29.4","1:29.3","1:29.2","1:29.1","1:29.0","1:28.9","1:28.8","1:28.6","1:28.5","1:28.4","1:28.3","1:28.2","1:28.4","1:28.3","1:28.2","1:28.1","1:28.0","1:27.9","1:28.1","1:28.0","1:27.9","1:27.8","1:27.9","1:28.0","1:27.9","1:27.8","1:27.7"],
        { 10: "pit" }
      ),
    },
    {
      driverId: "lec",
      laps: makeLaps(
        [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        ["1:30.5","1:30.2","1:29.9","1:29.6","1:29.5","1:29.4","1:29.3","1:29.2","1:29.1","1:29.0","1:28.8","1:28.7","1:28.6","1:28.5","1:28.4","1:28.6","1:28.5","1:28.4","1:28.3","1:28.2","1:28.1","1:28.3","1:28.2","1:28.1","1:28.0","1:28.1","1:28.2","1:28.1","1:28.0","1:27.9"],
        { 11: "pit" }
      ),
    },
    {
      driverId: "sai",
      laps: makeLaps(
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        ["1:30.7","1:30.4","1:30.1","1:29.8","1:29.7","1:29.6","1:29.5","1:29.4","1:29.3","1:29.2","1:29.0","1:28.9","1:28.8","1:28.7","1:28.6","1:28.8","1:28.7","1:28.6","1:28.5","1:28.4","1:28.3","1:28.5","1:28.4","1:28.3","1:28.2","1:28.3","1:28.4","1:28.3","1:28.2","1:28.1"],
        { 12: "pit" }
      ),
    },
    {
      driverId: "pia",
      laps: makeLaps(
        [6,6,6,6,6,6,6,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
        ["1:30.9","1:30.6","1:30.3","1:30.0","1:29.9","1:29.8","1:29.7","1:29.6","1:33.2","1:29.4","1:29.2","1:29.1","1:29.0","1:28.9","1:28.8","1:29.0","1:28.9","1:28.8","1:28.7","1:28.6","1:28.5","1:28.7","1:28.6","1:28.5","1:28.4","1:28.5","1:28.6","1:28.5","1:28.4","1:28.3"],
        { 8: "pit" }
      ),
    },
    {
      driverId: "rus",
      laps: makeLaps(
        [7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0],
        ["1:31.1","1:30.8","1:30.5","1:30.2","1:30.1","1:30.0","1:29.9","1:29.8","1:29.7","1:29.6","1:29.4","1:29.3","1:29.2","1:29.1","1:29.0","1:29.2","1:29.1","1:29.0","1:28.9","1:28.8","1:28.7","1:28.9","1:28.8","1:28.7","1:28.6","1:28.7","1:28.8","1:28.7","DNF","DNF"],
        { 13: "pit", 29: "accident" }
      ),
    },
    {
      driverId: "per",
      laps: makeLaps(
        [8,8,8,8,8,8,8,8,8,8,8,8,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        ["1:31.3","1:31.0","1:30.7","1:30.4","1:30.3","1:30.2","1:30.1","1:30.0","1:29.9","1:29.8","1:29.6","1:29.5","1:29.4","1:29.3","1:29.2","1:29.4","1:29.3","1:29.2","1:29.1","1:29.0","1:28.9","1:29.1","1:29.0","1:28.9","1:28.8","1:28.9","1:29.0","1:28.9","1:28.8","1:28.7"],
        { 13: "pit" }
      ),
    },
  ],
};

const australian2024Laps: RaceLapData = {
  circuitId: "mel",
  circuitName: "Australian GP",
  totalLaps: 30,
  drivers: [
    {
      driverId: "sai",
      laps: makeLaps(
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ["1:20.8","1:20.5","1:20.2","1:20.0","1:19.9","1:19.8","1:19.7","1:19.6","1:19.5","1:19.4","1:19.3","1:23.4","1:19.1","1:19.0","1:18.9","1:19.1","1:19.0","1:18.9","1:18.8","1:18.7","1:18.6","1:18.8","1:18.7","1:18.6","1:18.5","1:18.6","1:18.7","1:18.6","1:18.5","1:18.4"],
        { 12: "pit" }
      ),
    },
    {
      driverId: "lec",
      laps: makeLaps(
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ["1:21.0","1:20.7","1:20.4","1:20.2","1:20.1","1:20.0","1:19.9","1:19.8","1:19.7","1:19.6","1:19.5","1:23.6","1:19.3","1:19.2","1:19.1","1:19.3","1:19.2","1:19.1","1:19.0","1:18.9","1:18.8","1:19.0","1:18.9","1:18.8","1:18.7","1:18.8","1:18.9","1:18.8","1:18.7","1:18.6"],
        { 12: "pit" }
      ),
    },
    {
      driverId: "nor",
      laps: makeLaps(
        [3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        ["1:21.2","1:20.9","1:20.6","1:20.4","1:20.3","1:20.2","1:20.1","1:20.0","1:19.9","1:19.8","1:19.7","1:19.6","1:19.5","1:23.8","1:19.3","1:19.5","1:19.4","1:19.3","1:19.2","1:19.1","1:19.0","1:19.2","1:19.1","1:19.0","1:18.9","1:19.0","1:19.1","1:19.0","1:18.9","1:18.8"],
        { 14: "pit" }
      ),
    },
    {
      driverId: "ver",
      laps: makeLaps(
        [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ["1:21.4","1:21.1","1:20.8","1:20.6","1:20.5","1:20.4","1:20.3","1:20.2","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF"],
        { 9: "dnf" }
      ),
    },
    {
      driverId: "pia",
      laps: makeLaps(
        [5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        ["1:21.6","1:21.3","1:21.0","1:20.8","1:20.7","1:20.6","1:20.5","1:20.4","1:24.1","1:20.2","1:20.0","1:19.9","1:19.8","1:19.7","1:19.6","1:19.8","1:19.7","1:19.6","1:19.5","1:19.4","1:19.3","1:19.5","1:19.4","1:19.3","1:19.2","1:19.3","1:19.4","1:19.3","1:19.2","1:19.1"],
        { 9: "pit" }
      ),
    },
    {
      driverId: "ham",
      laps: makeLaps(
        [6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        ["1:21.8","1:21.5","1:21.2","1:21.0","1:20.9","1:20.8","1:20.7","1:20.6","1:24.3","1:20.4","1:20.2","1:20.1","1:20.0","1:19.9","1:19.8","1:20.0","1:19.9","1:19.8","1:19.7","1:19.6","1:19.5","1:19.7","1:19.6","1:19.5","1:19.4","1:19.5","1:19.6","1:19.5","1:19.4","1:19.3"],
        { 9: "pit" }
      ),
    },
    {
      driverId: "rus",
      laps: makeLaps(
        [7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
        ["1:22.0","1:21.7","1:21.4","1:21.2","1:21.1","1:21.0","1:20.9","1:20.8","1:24.5","1:20.6","1:20.4","1:20.3","1:20.2","1:20.1","1:20.0","1:20.2","1:20.1","1:20.0","1:19.9","1:19.8","1:19.7","1:19.9","1:19.8","1:19.7","1:19.6","1:19.7","1:19.8","1:19.7","1:19.6","1:19.5"],
        { 9: "pit" }
      ),
    },
    {
      driverId: "per",
      laps: makeLaps(
        [8,8,8,8,8,8,8,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        ["1:22.2","1:21.9","1:21.6","1:21.4","1:21.3","1:21.2","1:21.1","1:21.0","1:24.7","1:20.8","1:20.6","1:20.5","1:20.4","1:20.3","1:20.2","1:20.4","1:20.3","1:20.2","1:20.1","1:20.0","1:19.9","1:20.1","1:20.0","1:19.9","1:19.8","1:19.9","1:20.0","1:19.9","1:19.8","1:19.7"],
        { 9: "pit" }
      ),
    },
  ],
};

export const seasons: SeasonData[] = [
  {
    year: 2024,
    drivers: drivers2024,
    circuits: circuits2024,
    results: results2024,
    teams: teams2024,
    pointsProgression: pointsProgression2024,
    raceLaps: [bahrain2024Laps, british2024Laps, australian2024Laps],
  },
];

export const getSeasonYears = () => seasons.map(s => s.year);
export const getSeasonData = (year: number) => seasons.find(s => s.year === year);

