import { Trophy, Timer, Flag, Gauge } from "lucide-react";
import { type Driver } from "@/data/f1-data";

interface StatsCardsProps {
  drivers: Driver[];
  totalRaces: number;
}

const StatsCards = ({ drivers, totalRaces }: StatsCardsProps) => {
  const leader = drivers[0];
  const totalWins = drivers.reduce((acc, d) => acc + d.wins, 0);
  const avgPoints = drivers.length
    ? Math.round(drivers.reduce((acc, d) => acc + d.points, 0) / drivers.length)
    : "—";

  const stats = [
    {
      label: "Líder do Campeonato",
      value: leader?.name ?? "-",
      sub: leader ? `${leader.points} pts` : "Sem classificação",
      icon: Trophy,
      highlight: true,
    },
    {
      label: "Total de Corridas",
      value: totalRaces,
      sub: "na temporada",
      icon: Flag,
    },
    {
      label: "Vitórias Totais",
      value: totalWins,
      sub: "entre pilotos",
      icon: Timer,
    },
    {
      label: "Média de Pontos",
      value: avgPoints,
      sub: "por piloto",
      icon: Gauge,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`min-w-0 rounded-2xl border p-3.5 sm:p-5 ${
            stat.highlight
              ? "bg-gradient-glow border-primary/30"
              : "bg-card border-border"
          }`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {stat.label}
            </span>
            <stat.icon
              className={`w-4 h-4 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          <p className={`break-words text-xl font-bold tracking-tight sm:text-2xl ${stat.highlight ? "text-primary" : "text-foreground"}`}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
