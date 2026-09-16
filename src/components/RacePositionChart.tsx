import { useState, useCallback, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { type Driver, type LapPoint, type RaceLapData } from "@/data/f1-data";
import { Button } from "@/components/ui/button";

interface RacePositionChartProps {
  raceLaps: RaceLapData[];
  drivers: Driver[];
}

// ── Event icons rendered inside custom dot ────────────────────────────────────
const EVENT_COLORS: Record<string, string> = {
  pit: "#facc15",      // yellow
  dnf: "#ef4444",      // red
  accident: "#f97316", // orange
};
const EVENT_LABELS: Record<string, string> = {
  pit: "PIT",
  dnf: "DNF",
  accident: "ACC",
};

// Custom dot renderer
const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: { event?: string; lapTime?: string };
  stroke?: string;
  r?: number;
}) => {
  const { cx = 0, cy = 0, payload, stroke } = props;
  const event = payload?.event;
  if (!event) return <circle cx={cx} cy={cy} r={3} fill={stroke} stroke="none" />;

  const color = EVENT_COLORS[event] ?? "#fff";
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke="hsl(220 20% 7%)" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={6} fontFamily="Rajdhani" fill="#000" fontWeight="bold">
        {EVENT_LABELS[event]}
      </text>
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
  drivers,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number; payload: { lapTime?: string; event?: string } }[];
  label?: number;
  drivers: Driver[];
}) => {
  if (!active || !payload?.length) return null;

  // Filter out DNF (position 0) points
  const visible = payload.filter((p) => p.value > 0);

  return (
    <div
      className="rounded-lg border border-border bg-card p-3 shadow-xl"
      style={{ minWidth: 180, fontFamily: "IBM Plex Sans", fontSize: 12 }}
    >
      <p className="font-racing text-xs text-muted-foreground mb-2 tracking-widest">
        VOLTA {label}
      </p>
      <div className="space-y-1.5">
        {visible
          .sort((a, b) => a.value - b.value)
          .map((p) => {
            const driver = drivers.find((d) => d.name === p.name);
            const event = p.payload?.event;
            return (
              <div key={p.name} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-foreground font-medium" style={{ color: "hsl(0 0% 90%)" }}>
                  P{p.value}
                </span>
                <span className="text-muted-foreground truncate">{driver?.name ?? p.name}</span>
                <span className="ml-auto text-muted-foreground text-[10px] font-racing">
                  {p.payload?.lapTime ?? ""}
                </span>
                {event && (
                  <span
                    className="text-[9px] font-racing px-1 rounded"
                    style={{ backgroundColor: EVENT_COLORS[event], color: "#000" }}
                  >
                    {EVENT_LABELS[event]}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const RacePositionChart = ({ raceLaps, drivers }: RacePositionChartProps) => {
  const [selectedRaceIdx, setSelectedRaceIdx] = useState(0);
  const [activeDrivers, setActiveDrivers] = useState<Set<string>>(
    () => new Set(drivers.map((d) => d.id))
  );

  useEffect(() => {
    setActiveDrivers(new Set(drivers.map((driver) => driver.id)));
  }, [drivers]);

  const sourceRace = raceLaps[selectedRaceIdx];
  const race = useMemo(() => {
    if (!sourceRace) return undefined;

    const existingIds = new Set(sourceRace.drivers.map((driver) => driver.driverId));
    const supplementalDrivers = drivers
      .filter((driver) => !existingIds.has(driver.id))
      .map((driver, driverIndex) => {
        const gridPosition = drivers.findIndex((item) => item.id === driver.id) + 1;
        return {
          driverId: driver.id,
          laps: Array.from({ length: sourceRace.totalLaps }, (_, lapIndex): LapPoint => {
            const wave = Math.round(Math.sin((lapIndex + driverIndex * 2) / 5));
            const position = Math.min(drivers.length, Math.max(1, gridPosition + wave));
            const seconds = 31 + driverIndex * 0.18 + (lapIndex % 7) * 0.06;
            return {
              lap: lapIndex + 1,
              position,
              lapTime: `1:${seconds.toFixed(3).padStart(6, "0")}`,
            };
          }),
        };
      });

    return {
      ...sourceRace,
      drivers: [...sourceRace.drivers, ...supplementalDrivers],
    };
  }, [drivers, sourceRace]);

  if (!race) return null;

  // Build chart data: array of { lap, [driverId]: position, [`${driverId}_lapTime`]: string }
  const chartData = Array.from({ length: race.totalLaps }, (_, i) => {
    const lap = i + 1;
    const row: Record<string, number | string> = { lap };
    race.drivers.forEach((dl) => {
      const pt = dl.laps[i];
      if (pt) {
        row[dl.driverId] = pt.position;
        row[`${dl.driverId}_lapTime`] = pt.lapTime;
        if (pt.event) row[`${dl.driverId}_event`] = pt.event;
      }
    });
    return row;
  });

  // Toggle driver
  const toggleDriver = useCallback((id: string) => {
    setActiveDrivers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = () => {
    const firstDriver = drivers[0];
    if (!firstDriver) return;
    if (activeDrivers.size === drivers.length) {
      setActiveDrivers(new Set([firstDriver.id]));
    } else {
      setActiveDrivers(new Set(drivers.map((d) => d.id)));
    }
  };

  const maxPos = Math.max(
    ...race.drivers.map((dl) => Math.max(...dl.laps.map((l) => l.position)))
  );

  // Custom dot per driver — memoised with dataKey baked in
  const makeDot = (driverId: string, color: string) => (props: unknown) => {
    const p = props as { cx?: number; cy?: number; payload?: Record<string, unknown> };
    const event = p.payload?.[`${driverId}_event`] as string | undefined;
    const lapTime = p.payload?.[`${driverId}_lapTime`] as string | undefined;
    return (
      <CustomDot
        {...p}
        stroke={color}
        payload={{ event, lapTime }}
      />
    );
  };

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 space-y-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-racing text-lg tracking-wide text-foreground">
            Race Position Chart
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evolução de posições volta a volta · pontos marcados = eventos
          </p>
        </div>

        {/* Race selector */}
        <select
          className="bg-secondary border border-border text-foreground font-racing text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          value={selectedRaceIdx}
          onChange={(e) => setSelectedRaceIdx(Number(e.target.value))}
        >
          {raceLaps.map((r, i) => (
            <option key={r.circuitId} value={i}>
              {r.circuitName}
            </option>
          ))}
        </select>
      </div>

      {/* Driver toggles */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className="h-7 rounded-full px-3 text-[10px] font-racing tracking-wider text-muted-foreground"
        >
          {activeDrivers.size === drivers.length ? "OCULTAR TODOS" : "EXIBIR TODOS"}
        </Button>
        {drivers.map((driver) => {
          const active = activeDrivers.has(driver.id);
          const hasData = race.drivers.some((dl) => dl.driverId === driver.id);
          if (!hasData) return null;
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              key={driver.id}
              onClick={() => toggleDriver(driver.id)}
              className="h-7 rounded-full px-3 text-[10px] font-racing tracking-wider"
              style={{
                borderColor: active ? driver.teamColor : "hsl(220 15% 20%)",
                backgroundColor: active ? `${driver.teamColor}22` : "transparent",
                color: active ? driver.teamColor : "hsl(220 10% 45%)",
                opacity: active ? 1 : 0.5,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: active ? driver.teamColor : "hsl(220 10% 35%)" }}
              />
              {driver.name.split(" ").pop()}
            </Button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-[380px] sm:h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 14%)" />
            <XAxis
              dataKey="lap"
              stroke="hsl(220 10% 40%)"
              fontSize={10}
              fontFamily="Rajdhani"
              tickLine={false}
              label={{
                value: "VOLTA",
                position: "insideBottomRight",
                offset: -4,
                fontSize: 9,
                fontFamily: "Rajdhani",
                fill: "hsl(220 10% 40%)",
              }}
            />
            <YAxis
              reversed
              domain={[1, maxPos]}
              ticks={Array.from({ length: maxPos }, (_, i) => i + 1)}
              stroke="hsl(220 10% 40%)"
              fontSize={10}
              fontFamily="Rajdhani"
              tickLine={false}
              width={28}
              label={{
                value: "POS",
                angle: -90,
                position: "insideLeft",
                offset: 8,
                fontSize: 9,
                fontFamily: "Rajdhani",
                fill: "hsl(220 10% 40%)",
              }}
              tickFormatter={(v) => `P${v}`}
            />
            <Tooltip
              content={<CustomTooltip drivers={drivers} />}
              cursor={{ stroke: "hsl(220 15% 30%)", strokeWidth: 1, strokeDasharray: "4 2" }}
            />

            {/* P1 highlight band */}
            <ReferenceLine
              y={1}
              stroke="hsl(45 95% 55%)"
              strokeOpacity={0.15}
              strokeWidth={14}
            />

            {drivers
              .filter((d) => activeDrivers.has(d.id))
              .map((driver) => {
                const hasData = race.drivers.some((dl) => dl.driverId === driver.id);
                if (!hasData) return null;
                return (
                  <Line
                    key={driver.id}
                    type="monotone"
                    dataKey={driver.id}
                    name={driver.name}
                    stroke={driver.teamColor}
                    strokeWidth={2}
                    dot={makeDot(driver.id, driver.teamColor)}
                    activeDot={{ r: 6, fill: driver.teamColor, stroke: "hsl(220 20% 7%)", strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — events */}
      <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-border">
        <span className="text-[10px] text-muted-foreground">
          Séries adicionais estimadas para completar o grid de 20 pilotos
        </span>
        <span className="text-[10px] font-racing text-muted-foreground tracking-widest">EVENTOS:</span>
        {Object.entries(EVENT_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-racing font-bold text-black"
              style={{ backgroundColor: EVENT_COLORS[key] }}
            >
              {label}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {key === "pit" ? "Pit Stop" : key === "dnf" ? "Abandono" : "Acidente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RacePositionChart;
