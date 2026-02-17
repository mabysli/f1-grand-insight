import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Driver } from "@/data/f1-data";

interface DriverStandingsProps {
  drivers: Driver[];
  selectedDriver: string;
}

const DriverStandings = ({ drivers, selectedDriver }: DriverStandingsProps) => {
  const filtered =
    selectedDriver === "all"
      ? drivers
      : drivers.filter((d) => d.id === selectedDriver);

  const getMedalColor = (pos: number) => {
    if (pos === 1) return "text-f1-gold";
    if (pos === 2) return "text-f1-silver";
    if (pos === 3) return "text-f1-bronze";
    return "text-muted-foreground";
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="p-5 border-b border-border">
        <h2 className="font-racing text-lg tracking-wide text-foreground">
          Classificação dos Pilotos
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-racing text-xs w-12">POS</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs">PILOTO</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs">EQUIPE</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs text-right">PTS</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs text-right">VIT</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs text-right">PÓD</TableHead>
              <TableHead className="text-muted-foreground font-racing text-xs text-right">MELHOR VOLTA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((driver, i) => {
              const pos = drivers.indexOf(driver) + 1;
              return (
                <TableRow
                  key={driver.id}
                  className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <TableCell className={`font-racing font-bold ${getMedalColor(pos)}`}>
                    {pos}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: driver.teamColor }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">#{driver.number} · {driver.nationality}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-secondary-foreground">{driver.team}</TableCell>
                  <TableCell className="text-right font-racing font-bold text-foreground">
                    {driver.points}
                  </TableCell>
                  <TableCell className="text-right text-sm text-secondary-foreground">{driver.wins}</TableCell>
                  <TableCell className="text-right text-sm text-secondary-foreground">{driver.podiums}</TableCell>
                  <TableCell className="text-right text-sm font-mono text-f1-cyan">{driver.bestLap}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DriverStandings;
