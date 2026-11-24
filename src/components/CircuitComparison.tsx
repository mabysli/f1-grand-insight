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
    name: c.name.replace(/^GP /, ""),
    voltas: c.laps,
    comprimento: c.lengthKm,
  }));

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
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
            <YAxis yAxisId="voltas" allowDecimals={false}
              stroke="hsl(220 10% 55%)"
              fontSize={11}
              fontFamily="Space Grotesk"
              tickLine={false}
            />
            <YAxis yAxisId="km" orientation="right" unit=" km" width={55} fontSize={11} />
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
              yAxisId="voltas" dataKey="voltas"
              name="Voltas completadas"
              fill="hsl(0 85% 50%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="km" dataKey="comprimento"
              name="Comprimento por volta (km)"
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
