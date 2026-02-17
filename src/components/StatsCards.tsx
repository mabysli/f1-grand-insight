import { Trophy, Timer, Flag, Gauge } from "lucide-react";
import { type Driver } from "@/data/f1-data";

interface StatsCardsProps {
  drivers: Driver[];
  totalRaces: number;
}

const StatsCards = ({ drivers, totalRaces }: StatsCardsProps) => {
  const leader = drivers[0];
  const totalWins = drivers.reduce((acc, d) => acc + d.wins, 0);
  const avgPoints = Math.round(drivers.reduce((acc, d) => acc + d.points, 0) / drivers.length);

  const stats = [
    {
      label: "Líder do Campeonato",
      value: leader?.name ?? "-",
      sub: `${leader?.points} pts`,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border p-5 animate-slide-in transition-all hover:scale-[1.02] ${
            stat.highlight
              ? "bg-gradient-glow border-primary/30 glow-red"
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
          <p className={`text-2xl font-bold font-racing ${stat.highlight ? "text-gradient-racing" : "text-foreground"}`}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
