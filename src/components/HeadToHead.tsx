import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Swords } from "lucide-react";
import type { Driver, Team } from "@/data/f1-data";

interface HeadToHeadProps {
  drivers: Driver[];
  teams: Team[];
}

type Mode = "drivers" | "teams";

const StatRow = ({
  label,
  a,
  b,
  colorA,
  colorB,
  higherBetter = true,
  format = (v: number | string) => String(v),
}: {
  label: string;
  a: number;
  b: number;
  colorA: string;
  colorB: string;
  higherBetter?: boolean;
  format?: (v: number) => string;
}) => {
  const aWins = higherBetter ? a > b : a < b;
  const bWins = higherBetter ? b > a : b < a;
  const max = Math.max(a, b, 1);
  const aPct = (a / max) * 100;
  const bPct = (b / max) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-racing tracking-wider text-muted-foreground">
        <span className={aWins ? "text-foreground font-bold" : ""}>{format(a)}</span>
        <span>{label}</span>
        <span className={bWins ? "text-foreground font-bold" : ""}>{format(b)}</span>
      </div>
      <div className="flex items-center gap-1 h-2">
        <div className="flex-1 bg-secondary/40 rounded-l overflow-hidden flex justify-end">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${aPct}%`, backgroundColor: colorA }}
          />
        </div>
        <div className="flex-1 bg-secondary/40 rounded-r overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${bPct}%`, backgroundColor: colorB }}
          />
        </div>
      </div>
    </div>
  );
};

const HeadToHead = ({ drivers, teams }: HeadToHeadProps) => {
  const [mode, setMode] = useState<Mode>("drivers");
  const [aId, setAId] = useState<string>(drivers[0]?.id ?? "");
  const [bId, setBId] = useState<string>(drivers[1]?.id ?? "");

  const list = mode === "drivers" ? drivers : teams;

  // Reset ids when list changes / mode changes
  const validA = list.find((x) => x.id === aId)?.id ?? list[0]?.id ?? "";
  const validB = list.find((x) => x.id === bId && x.id !== validA)?.id ??
    list.find((x) => x.id !== validA)?.id ?? "";

  const entityA = list.find((x) => x.id === validA);
  const entityB = list.find((x) => x.id === validB);

  const colorA =
    mode === "drivers"
      ? (entityA as Driver | undefined)?.teamColor ?? "#e10600"
      : (entityA as Team | undefined)?.color ?? "#e10600";
  const colorB =
    mode === "drivers"
      ? (entityB as Driver | undefined)?.teamColor ?? "#00d2be"
      : (entityB as Team | undefined)?.color ?? "#00d2be";

  const radarData = useMemo(() => {
    if (!entityA || !entityB) return [];
    if (mode === "drivers") {
      const a = entityA as Driver;
      const b = entityB as Driver;
      const maxPts = Math.max(a.points, b.points, 1);
      const maxWins = Math.max(a.wins, b.wins, 1);
      const maxPod = Math.max(a.podiums, b.podiums, 1);
      return [
        { metric: "Pontos", A: (a.points / maxPts) * 100, B: (b.points / maxPts) * 100 },
        { metric: "Vitórias", A: (a.wins / maxWins) * 100, B: (b.wins / maxWins) * 100 },
        { metric: "Pódios", A: (a.podiums / maxPod) * 100, B: (b.podiums / maxPod) * 100 },
        {
          metric: "Consistência",
          A: a.podiums > 0 ? Math.min(100, (a.podiums / Math.max(a.wins, 1)) * 40) : 20,
          B: b.podiums > 0 ? Math.min(100, (b.podiums / Math.max(b.wins, 1)) * 40) : 20,
        },
        {
          metric: "Aproveitamento",
          A: Math.min(100, (a.points / Math.max(maxPts, 1)) * 100),
          B: Math.min(100, (b.points / Math.max(maxPts, 1)) * 100),
        },
      ];
    }
    const a = entityA as Team;
    const b = entityB as Team;
    const maxPts = Math.max(a.points, b.points, 1);
    const maxWins = Math.max(a.wins, b.wins, 1);
    const maxPod = Math.max(a.podiums, b.podiums, 1);
    return [
      { metric: "Pontos", A: (a.points / maxPts) * 100, B: (b.points / maxPts) * 100 },
      { metric: "Vitórias", A: (a.wins / maxWins) * 100, B: (b.wins / maxWins) * 100 },
      { metric: "Pódios", A: (a.podiums / maxPod) * 100, B: (b.podiums / maxPod) * 100 },
      {
        metric: "Chegada Média",
        A: Math.max(0, 100 - a.avgFinish * 8),
        B: Math.max(0, 100 - b.avgFinish * 8),
      },
      {
        metric: "Confiabilidade",
        A: Math.min(100, (a.podiums / Math.max(a.wins || 1, 1)) * 40 + 40),
        B: Math.min(100, (b.podiums / Math.max(b.wins || 1, 1)) * 40 + 40),
      },
    ];
  }, [entityA, entityB, mode]);

  if (list.length < 2) return null;

  const nameA = mode === "drivers" ? (entityA as Driver)?.name : (entityA as Team)?.name;
  const nameB = mode === "drivers" ? (entityB as Driver)?.name : (entityB as Team)?.name;
  const subA =
    mode === "drivers"
      ? `#${(entityA as Driver)?.number} · ${(entityA as Driver)?.team}`
      : (entityA as Team)?.drivers.join(" · ");
  const subB =
    mode === "drivers"
      ? `#${(entityB as Driver)?.number} · ${(entityB as Driver)?.team}`
      : (entityB as Team)?.drivers.join(" · ");

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 space-y-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Swords className="h-5 w-5 text-primary" />
          <h2 className="font-racing text-lg tracking-wide text-foreground">
            Confronto Direto
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setMode("drivers")}
              className={`px-3 py-1.5 text-xs font-racing tracking-wider transition-colors ${
                mode === "drivers"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              PILOTOS
            </button>
            <button
              onClick={() => setMode("teams")}
              className={`px-3 py-1.5 text-xs font-racing tracking-wider transition-colors ${
                mode === "teams"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              EQUIPES
            </button>
          </div>

          <Select value={validA} onValueChange={setAId}>
            <SelectTrigger className="w-[180px] bg-card border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {list.map((x) => (
                <SelectItem key={x.id} value={x.id} disabled={x.id === validB}>
                  {"name" in x ? x.name : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="self-center text-xs font-racing text-muted-foreground">VS</span>

          <Select value={validB} onValueChange={setBId}>
            <SelectTrigger className="w-[180px] bg-card border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {list.map((x) => (
                <SelectItem key={x.id} value={x.id} disabled={x.id === validA}>
                  {"name" in x ? x.name : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {entityA && entityB && (
        <>
          {/* Headers */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-lg border border-border p-4 relative overflow-hidden"
              style={{ borderLeftWidth: 4, borderLeftColor: colorA }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5" style={{ color: colorA }} />
                <span className="text-[10px] font-racing tracking-widest text-muted-foreground">
                  LADO A
                </span>
              </div>
              <p className="font-racing text-base text-foreground truncate">{nameA}</p>
              <p className="text-xs text-muted-foreground truncate">{subA}</p>
            </div>

            <div
              className="rounded-lg border border-border p-4 relative overflow-hidden text-right"
              style={{ borderRightWidth: 4, borderRightColor: colorB }}
            >
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-[10px] font-racing tracking-widest text-muted-foreground">
                  LADO B
                </span>
                <Users className="h-3.5 w-3.5" style={{ color: colorB }} />
              </div>
              <p className="font-racing text-base text-foreground truncate">{nameB}</p>
              <p className="text-xs text-muted-foreground truncate">{subB}</p>
            </div>
          </div>

          {/* Comparative bars */}
          <div className="space-y-4">
            <StatRow
              label="PONTOS"
              a={entityA.points}
              b={entityB.points}
              colorA={colorA}
              colorB={colorB}
            />
            <StatRow
              label="VITÓRIAS"
              a={entityA.wins}
              b={entityB.wins}
              colorA={colorA}
              colorB={colorB}
            />
            <StatRow
              label="PÓDIOS"
              a={entityA.podiums}
              b={entityB.podiums}
              colorA={colorA}
              colorB={colorB}
            />
            {mode === "teams" && (
              <StatRow
                label="CHEGADA MÉDIA"
                a={(entityA as Team).avgFinish}
                b={(entityB as Team).avgFinish}
                colorA={colorA}
                colorB={colorB}
                higherBetter={false}
                format={(v) => v.toFixed(1)}
              />
            )}
          </div>

          {/* Radar */}
          <div className="h-[320px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="hsl(220 15% 18%)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "hsl(220 10% 65%)", fontSize: 11, fontFamily: "Rajdhani" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(220 10% 45%)", fontSize: 9 }}
                  tickCount={4}
                />
                <Radar
                  name={nameA}
                  dataKey="A"
                  stroke={colorA}
                  fill={colorA}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name={nameB}
                  dataKey="B"
                  stroke={colorB}
                  fill={colorB}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Legend
                  wrapperStyle={{ fontFamily: "Rajdhani", fontSize: "10px", paddingTop: "10px" }}
                  formatter={(v) => <span style={{ color: "hsl(0 0% 80%)" }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 18% 12%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    fontFamily: "IBM Plex Sans",
                    fontSize: "12px",
                    color: "hsl(0 0% 95%)",
                  }}
                  formatter={(v: number) => `${v.toFixed(0)}%`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default HeadToHead;
