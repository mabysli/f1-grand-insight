import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Circuit } from "@/data/f1-data";

interface CircuitComparisonProps {
  circuits: Circuit[];
  selectedCircuit: string;
}

const metrics = {
  length: { label: "Extensão da volta", unit: "km", color: "hsl(var(--chart-2))" },
  laps: { label: "Voltas completadas", unit: "voltas", color: "hsl(var(--primary))" },
} as const;

export default function CircuitComparison({ circuits, selectedCircuit }: CircuitComparisonProps) {
  const [metric, setMetric] = useState<keyof typeof metrics>("length");
  const { label, unit, color } = metrics[metric];
  const data = circuits
    .filter((circuit) => selectedCircuit === "all" || circuit.id === selectedCircuit)
    .flatMap((circuit) => {
      const value = metric === "length" ? circuit.lengthKm : circuit.laps;
      return value ? [{ name: circuit.name.replace(/^GP /, ""), value }] : [];
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">Comparação de circuitos</h2>
      <div aria-label="Métrica da comparação" role="group" className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(metrics) as (keyof typeof metrics)[]).map((key) => (
          <button type="button" key={key} aria-pressed={metric === key} onClick={() => setMetric(key)}
            className="rounded-full border px-3 py-1.5 text-xs font-medium aria-pressed:border-primary aria-pressed:text-primary">
            {metrics[key].label}
          </button>
        ))}
      </div>
      {data.length ? (
        <div className="max-h-[310px] overflow-y-auto" tabIndex={data.length > 8 ? 0 : undefined} aria-label={label}>
          <ResponsiveContainer width="100%" height={Math.max(130, data.length * 35 + 25)}>
            <BarChart data={data} layout="vertical" margin={{ right: 20 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" unit={metric === "length" ? " km" : undefined}
                allowDecimals={metric === "length"} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="name" interval={0} width={105} tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString("pt-BR")} ${unit}`, label]}
                contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
              <Bar dataKey="value" fill={color} radius={[0, 5, 5, 0]} maxBarSize={18} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <p className="py-10 text-sm text-muted-foreground">Sem dados para esta métrica.</p>}
    </div>
  );
}
