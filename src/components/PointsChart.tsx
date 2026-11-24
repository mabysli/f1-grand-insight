import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type Driver } from "@/data/f1-data";

interface PointsChartProps {
  data: { race: string; [key: string]: number | string }[];
  drivers: Driver[];
  selectedDriver: string;
}

const PointsChart = ({ data, drivers, selectedDriver }: PointsChartProps) => {
  const visibleDrivers =
    selectedDriver === "all"
      ? drivers.slice(0, 6)
      : drivers.filter((d) => d.id === selectedDriver);

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">
        Progressão de Pontos
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">Pontos acumulados nas corridas e sprints · até 6 pilotos quando nenhum filtro é selecionado</p>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis
              dataKey="round"
              tickFormatter={(round) => `R${round}`}
              stroke="hsl(220 10% 55%)"
              fontSize={11}
              fontFamily="Space Grotesk"
              tickLine={false}
            />
            <YAxis
              stroke="hsl(220 10% 55%)"
              fontSize={11}
              fontFamily="Space Grotesk"
              tickLine={false}
            />
            <Tooltip
              labelFormatter={(_, entries) => entries[0]?.payload?.race ?? ""}
              formatter={(points, name) => [`${points} pts`, name]}
              contentStyle={{
                backgroundColor: "hsl(220 18% 12%)",
                border: "1px solid hsl(220 15% 18%)",
                borderRadius: "8px",
                fontFamily: "Inter",
                fontSize: "12px",
                color: "hsl(0 0% 95%)",
              }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "Inter", fontSize: "12px" }}
            />
            {visibleDrivers.map((driver, index) => (
              <Line
                key={driver.id}
                type="linear"
                dataKey={driver.id}
                name={driver.name}
                stroke={driver.teamColor}
                strokeWidth={2.5}
                dot={false}
                strokeDasharray={index % 2 ? "6 3" : undefined}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PointsChart;
