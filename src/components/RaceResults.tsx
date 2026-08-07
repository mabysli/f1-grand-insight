import { type RaceResult, type Driver } from "@/data/f1-data";

interface RaceResultsProps {
  results: RaceResult[];
  selectedCircuit: string;
  selectedDriver: string;
  circuitNames: { id: string; name: string }[];
  drivers: Driver[];
}

const RaceResults = ({ results, selectedCircuit, selectedDriver, circuitNames, drivers }: RaceResultsProps) => {
  let filtered = results;

  if (selectedCircuit !== "all") {
    const circuitName = circuitNames.find((c) => c.id === selectedCircuit)?.name;
    if (circuitName) filtered = filtered.filter((r) => r.circuit === circuitName);
  }

  if (selectedDriver !== "all") {
    const name = drivers.find((d) => d.id === selectedDriver)?.name;
    if (name) filtered = filtered.filter((r) => r.driver === name);
  }

  const getMedalBg = (pos: number) => {
    if (pos === 1) return "bg-f1-gold/10 text-f1-gold";
    if (pos === 2) return "bg-f1-silver/10 text-f1-silver";
    if (pos === 3) return "bg-f1-bronze/10 text-f1-bronze";
    return "bg-secondary text-muted-foreground";
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="font-racing text-lg tracking-wide text-foreground mb-4">
        Resultados das Corridas
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            Nenhum resultado encontrado para os filtros selecionados.
          </p>
        ) : (
          filtered.map((result, i) => (
            <div
              key={`${result.circuit}-${result.driver}-${i}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-racing font-bold text-sm ${getMedalBg(result.position)}`}
              >
                P{result.position}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{result.driver}</p>
                <p className="text-xs text-muted-foreground">{result.circuit}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-f1-cyan">{result.fastestLap}</p>
                <p className="text-xs text-muted-foreground">{result.gap}</p>
              </div>
              <div className="font-racing font-bold text-sm text-foreground">
                {result.points} pts
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RaceResults;
