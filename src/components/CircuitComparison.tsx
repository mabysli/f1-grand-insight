import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type Circuit } from "@/data/f1-data";

interface CircuitComparisonProps {
  circuits: Circuit[];
  selectedCircuit: string;
}

const CircuitComparison = ({ circuits, selectedCircuit }: CircuitComparisonProps) => {
  const filtered =
    selectedCircuit === "all"
      ? circuits
      : circuits.filter((c) => c.id === selectedCircuit);

  const data = filtered.map((c) => ({
    name: c.name.replace(" GP", ""),
    voltas: c.laps,
    comprimento: parseFloat(c.length.replace(" km", "")),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="font-racing text-lg tracking-wide text-foreground mb-4">
        Comparação de Circuitos
      </h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(220 10% 55%)"
              fontSize={10}
              tickLine={false}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="hsl(220 10% 55%)"
              fontSize={11}
              fontFamily="Orbitron"
              tickLine={false}
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
            <Bar
              dataKey="voltas"
              name="Voltas"
              fill="hsl(0 85% 50%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="comprimento"
              name="Comprimento (km)"
              fill="hsl(200 80% 55%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CircuitComparison;
