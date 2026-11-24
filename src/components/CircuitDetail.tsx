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
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Circuitos da temporada
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((circuit) => (
          <div
            key={circuit.id}
            className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Track image */}
            <div className="track-panel relative flex h-48 items-center justify-center border-b border-border px-8 pb-3 pt-7">
              {circuit.trackPath && (
                <svg
                  viewBox="0 0 240 160"
                  role="img"
                  aria-label={`Traçado de ${circuit.trackName ?? circuit.name}`}
                  className="h-full w-full text-primary transition-transform duration-300 motion-safe:group-hover:scale-105"
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
              <h3 className="text-base font-semibold text-foreground">
                {circuit.name}
              </h3>

              <p className="text-sm text-muted-foreground">{circuit.trackName}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin aria-hidden="true" className="h-3 w-3" />
                  {circuit.lengthKm ? `${circuit.length} por volta` : "Extensão indisponível"}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge aria-hidden="true" className="h-3 w-3" />
                  {circuit.laps ? `${circuit.laps} voltas completadas` : circuit.completed ? "Voltas indisponíveis" : "Aguardando resultado"}
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
