import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Driver, type Circuit } from "@/data/f1-data";

interface FilterBarProps {
  seasons: number[];
  selectedSeason: number;
  onSeasonChange: (year: number) => void;
  drivers: Driver[];
  selectedDriver: string;
  onDriverChange: (id: string) => void;
  circuits: Circuit[];
  selectedCircuit: string;
  onCircuitChange: (id: string) => void;
}

const FilterBar = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  drivers,
  selectedDriver,
  onDriverChange,
  circuits,
  selectedCircuit,
  onCircuitChange,
}: FilterBarProps) => {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
      <div className="min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Temporada</p>
        <Select
          value={String(selectedSeason)}
          onValueChange={(v) => onSeasonChange(Number(v))}
        >
          <SelectTrigger aria-label="Temporada" className="h-10 w-full bg-background text-sm">
            <SelectValue placeholder="Temporada" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {seasons.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Piloto</p>
        <Select value={selectedDriver} onValueChange={onDriverChange}>
          <SelectTrigger aria-label="Piloto" className="h-10 w-full bg-background text-sm">
            <SelectValue placeholder="Todos os Pilotos" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todos os Pilotos</SelectItem>
            {drivers.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Circuito</p>
        <Select value={selectedCircuit} onValueChange={onCircuitChange}>
          <SelectTrigger aria-label="Circuito" className="h-10 w-full bg-background text-sm">
            <SelectValue placeholder="Todos os Circuitos" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todos os Circuitos</SelectItem>
            {circuits.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
