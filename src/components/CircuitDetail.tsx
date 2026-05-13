import { type Circuit } from "@/data/f1-data";
import { Clock, MapPin, Gauge } from "lucide-react";

// Circuit image imports
import bahrain from "@/assets/circuits/bahrain.png";
import jeddah from "@/assets/circuits/jeddah.png";
import melbourne from "@/assets/circuits/melbourne.png";
import suzuka from "@/assets/circuits/suzuka.png";
import shanghai from "@/assets/circuits/shanghai.png";
import miami from "@/assets/circuits/miami.png";
import imola from "@/assets/circuits/imola.png";
import monaco from "@/assets/circuits/monaco.png";
import barcelona from "@/assets/circuits/barcelona.png";
import silverstone from "@/assets/circuits/silverstone.png";

const circuitImages: Record<string, string> = {
  // legacy short ids
  bah: bahrain, jed: jeddah, mel: melbourne, suz: suzuka, sha: shanghai,
  mia: miami, imo: imola, mon: monaco, bar: barcelona, sil: silverstone,
  // f1api.dev ids
  bahrain, jeddah, suzuka, shanghai, miami, imola, monaco, silverstone,
  albert_park: melbourne,
  montmelo: barcelona,
};

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
            className="rounded-xl border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Track image */}
            <div className="relative h-48 bg-secondary/50 flex items-center justify-center p-4">
              <img
                src={circuitImages[circuit.id]}
                alt={`Trajeto ${circuit.name}`}
                className="h-full w-full object-contain opacity-90"
              />
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

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {circuit.length}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-3 w-3" /> {circuit.laps} voltas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {circuit.fastestLap}
                </span>
              </div>

              {/* Sector times */}
              <div className="space-y-1.5">
                <p className="text-xs font-racing tracking-wider text-muted-foreground">
                  MELHORES TEMPOS POR SETOR
                </p>
                {circuit.sectors.map((s) => (
                  <div
                    key={s.sector}
                    className="flex items-center justify-between text-xs bg-secondary/60 rounded-md px-3 py-1.5"
                  >
                    <span className="font-racing text-accent-foreground" style={{ color: `hsl(var(--chart-${s.sector}))` }}>
                      S{s.sector}
                    </span>
                    <span className="font-mono text-foreground">{s.time}</span>
                    <span className="text-muted-foreground truncate ml-2 max-w-[100px]">
                      {s.driver}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitDetail;
