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
    <div className="flex flex-wrap gap-3">
      <Select
        value={String(selectedSeason)}
        onValueChange={(v) => onSeasonChange(Number(v))}
      >
        <SelectTrigger className="w-[140px] bg-card border-border font-racing text-sm">
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

      <Select value={selectedDriver} onValueChange={onDriverChange}>
        <SelectTrigger className="w-[200px] bg-card border-border text-sm">
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

      <Select value={selectedCircuit} onValueChange={onCircuitChange}>
        <SelectTrigger className="w-[200px] bg-card border-border text-sm">
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
  );
};

export default FilterBar;
