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
    <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="font-racing text-lg tracking-wide text-foreground mb-4">
        Progressão de Pontos
      </h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis
              dataKey="race"
              stroke="hsl(220 10% 55%)"
              fontSize={11}
              fontFamily="Orbitron"
              tickLine={false}
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
            <Legend
              wrapperStyle={{ fontFamily: "Inter", fontSize: "12px" }}
            />
            {visibleDrivers.map((driver) => (
              <Line
                key={driver.id}
                type="monotone"
                dataKey={driver.id}
                name={driver.name}
                stroke={driver.teamColor}
                strokeWidth={2.5}
                dot={{ r: 3, fill: driver.teamColor }}
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
