import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { type Team } from "@/data/f1-data";
import { Trophy, Medal, TrendingUp } from "lucide-react";

interface TeamComparisonProps {
  teams: Team[];
}

// Derived metrics per team (0-100 scale)
const teamMetrics: Record<string, { speed: number; reliability: number; strategy: number; pace: number; qualifying: number }> = {
  redbull:  { speed: 92, reliability: 78, strategy: 88, pace: 90, qualifying: 88 },
  mclaren:  { speed: 90, reliability: 85, strategy: 82, pace: 88, qualifying: 86 },
  ferrari:  { speed: 87, reliability: 80, strategy: 75, pace: 85, qualifying: 87 },
  mercedes: { speed: 82, reliability: 88, strategy: 84, pace: 80, qualifying: 82 },
};

const TeamComparison = ({ teams }: TeamComparisonProps) => {
  const sorted = [...teams].sort((a, b) => b.points - a.points);

  const chartData = sorted.map((t) => ({
    name: t.name.replace(" Racing", ""),
    points: t.points,
    color: t.color,
  }));

  const radarData = [
    { metric: "Velocidade",    ...Object.fromEntries(sorted.map(t => [t.id, teamMetrics[t.id]?.speed ?? 70])) },
    { metric: "Confiabilidade",...Object.fromEntries(sorted.map(t => [t.id, teamMetrics[t.id]?.reliability ?? 70])) },
    { metric: "Estratégia",    ...Object.fromEntries(sorted.map(t => [t.id, teamMetrics[t.id]?.strategy ?? 70])) },
    { metric: "Ritmo de Corrida",...Object.fromEntries(sorted.map(t => [t.id, teamMetrics[t.id]?.pace ?? 70])) },
    { metric: "Classificação", ...Object.fromEntries(sorted.map(t => [t.id, teamMetrics[t.id]?.qualifying ?? 70])) },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-racing text-lg tracking-wide text-foreground">
        Comparação de Equipes
      </h2>

      {/* Team rankings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((team, i) => (
          <div
            key={team.id}
            className="rounded-xl border border-border bg-card p-4 relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Position accent */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: team.color }}
            />

            <div className="pl-3 space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="font-racing text-2xl font-bold"
                  style={{ color: team.color }}
                >
                  P{i + 1}
                </span>
                <span className="font-racing text-xs tracking-wider text-muted-foreground">
                  {team.name}
                </span>
              </div>

              <div className="font-racing text-3xl text-foreground">
                {team.points}
                <span className="text-xs text-muted-foreground ml-1">PTS</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary/60 rounded-md py-1.5">
                  <Trophy className="h-3 w-3 mx-auto mb-0.5 text-[hsl(var(--f1-gold))]" />
                  <span className="text-xs font-racing text-foreground">{team.wins}</span>
                  <p className="text-[10px] text-muted-foreground">Vit.</p>
                </div>
                <div className="bg-secondary/60 rounded-md py-1.5">
                  <Medal className="h-3 w-3 mx-auto mb-0.5 text-[hsl(var(--f1-silver))]" />
                  <span className="text-xs font-racing text-foreground">{team.podiums}</span>
                  <p className="text-[10px] text-muted-foreground">Pód.</p>
                </div>
                <div className="bg-secondary/60 rounded-md py-1.5">
                  <TrendingUp className="h-3 w-3 mx-auto mb-0.5 text-[hsl(var(--f1-cyan))]" />
                  <span className="text-xs font-racing text-foreground">{team.avgFinish}</span>
                  <p className="text-[10px] text-muted-foreground">Méd.</p>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground">
                {team.drivers.join(" · ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Points bar chart */}
      <div
        className="rounded-xl border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h3 className="font-racing text-sm tracking-wide text-foreground mb-4">
          Pontos Acumulados por Equipe
        </h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" horizontal={false} />
              <XAxis
                type="number"
                stroke="hsl(220 10% 55%)"
                fontSize={11}
                fontFamily="Orbitron"
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(220 10% 55%)"
                fontSize={11}
                fontFamily="Orbitron"
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 18% 12%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  color: "hsl(0 0% 95%)",
                }}
              />
              <Bar dataKey="points" name="Pontos" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar chart */}
      <div
        className="rounded-xl border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h3 className="font-racing text-sm tracking-wide text-foreground mb-1">
          Radar de Desempenho por Equipe
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Comparação multidimensional — velocidade, estratégia, confiabilidade, ritmo e classificação
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="hsl(220 15% 18%)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "hsl(220 10% 65%)", fontSize: 11, fontFamily: "Orbitron" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[60, 100]}
                tick={{ fill: "hsl(220 10% 45%)", fontSize: 9 }}
                tickCount={3}
              />
              {sorted.map((team) => (
                <Radar
                  key={team.id}
                  name={team.name.replace(" Racing", "")}
                  dataKey={team.id}
                  stroke={team.color}
                  fill={team.color}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ fontFamily: "Orbitron", fontSize: "10px", paddingTop: "12px" }}
                formatter={(value) => (
                  <span style={{ color: "hsl(0 0% 80%)" }}>{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 18% 12%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  color: "hsl(0 0% 95%)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamComparison;
