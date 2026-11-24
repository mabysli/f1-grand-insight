import { type Circuit } from "@/data/f1-data";
import { Clock, MapPin, Gauge } from "lucide-react";

interface CircuitDetailProps {
  circuits: Circuit[];
  selectedCircuit: string;
}

const CircuitDetail = ({ circuits, selectedCircuit }: CircuitDetailProps) => {
  const filtered =
    selectedCircuit === "all" ? circuits : circuits.filter((c) => c.id === selectedCircuit);

  return (
    <div className="space-y-4">
      <h2 className="font-racing text-lg tracking-wide text-foreground">
        Detalhes dos Circuitos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((circuit) => (
          <div
            key={circuit.id}
            className="rounded-lg border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Track image */}
            <div className="relative h-48 bg-secondary/50 flex items-center justify-center p-4">
              {circuit.trackPath && (
                <svg
                  viewBox="0 0 240 160"
                  role="img"
                  aria-label={`Traçado de ${circuit.trackName ?? circuit.name}`}
                  className="h-full w-full text-primary"
                >
                  <path
                    d={circuit.trackPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-racing tracking-wider text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {circuit.country}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <h3 className="font-racing text-sm tracking-wide text-foreground">
                {circuit.name}
              </h3>

              <p className="text-sm text-muted-foreground">{circuit.trackName}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin aria-hidden="true" className="h-3 w-3" />
                  {circuit.length} por volta
                </span>
                <span className="flex items-center gap-1">
                  <Gauge aria-hidden="true" className="h-3 w-3" />
                  {circuit.laps} voltas completadas
                </span>
                {circuit.fastestLap !== "-" && (
                  <span className="flex items-center gap-1">
                    <Clock aria-hidden="true" className="h-3 w-3" />
                    Volta mais rápida: {circuit.fastestLap}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitDetail;
