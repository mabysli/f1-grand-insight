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

export interface Circuit {
  id: string;
  name: string;
  country: string;
  laps: number;
  length: string;
  fastestLap: string;
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
  pointsProgression: { race: string; [driver: string]: number | string }[];
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
  { id: "bah", name: "Bahrain GP", country: "Bahrain", laps: 57, length: "5.412 km", fastestLap: "1:31.447" },
  { id: "jed", name: "Saudi Arabian GP", country: "Arábia Saudita", laps: 50, length: "6.174 km", fastestLap: "1:27.472" },
  { id: "mel", name: "Australian GP", country: "Austrália", laps: 58, length: "5.278 km", fastestLap: "1:19.813" },
  { id: "suz", name: "Japanese GP", country: "Japão", laps: 53, length: "5.807 km", fastestLap: "1:30.983" },
  { id: "sha", name: "Chinese GP", country: "China", laps: 56, length: "5.451 km", fastestLap: "1:33.584" },
  { id: "mia", name: "Miami GP", country: "EUA", laps: 57, length: "5.412 km", fastestLap: "1:29.708" },
  { id: "imo", name: "Emilia Romagna GP", country: "Itália", laps: 63, length: "4.909 km", fastestLap: "1:15.203" },
  { id: "mon", name: "Monaco GP", country: "Mônaco", laps: 78, length: "3.337 km", fastestLap: "1:12.143" },
  { id: "bar", name: "Spanish GP", country: "Espanha", laps: 66, length: "4.657 km", fastestLap: "1:13.704" },
  { id: "sil", name: "British GP", country: "Reino Unido", laps: 52, length: "5.891 km", fastestLap: "1:28.473" },
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

export const seasons: SeasonData[] = [
  {
    year: 2024,
    drivers: drivers2024,
    circuits: circuits2024,
    results: results2024,
    pointsProgression: pointsProgression2024,
  },
];

export const getSeasonYears = () => seasons.map(s => s.year);
export const getSeasonData = (year: number) => seasons.find(s => s.year === year);
