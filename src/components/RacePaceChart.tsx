import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchRacePace, fetchRaceSessions } from "@/services/openf1";

interface RacePaceChartProps {
  year: number;
  date: string;
  driverNumber: number;
}

function formatTime(seconds: number) {
  const milliseconds = Math.round(seconds * 1000);
  const minutes = Math.floor(milliseconds / 60000);
  const remainder = ((milliseconds % 60000) / 1000).toFixed(3).padStart(6, "0");
  return `${minutes}:${remainder}`;
}

export default function RacePaceChart({ year, date, driverNumber }: RacePaceChartProps) {
  const sessions = useQuery({
    queryKey: ["openf1-races", year],
    queryFn: ({ signal }) => fetchRaceSessions(year, signal),
    staleTime: 3600000,
    retry: false,
  });
  const session = sessions.data?.find((item) => item.date_start.slice(0, 10) === date);
  const pace = useQuery({
    queryKey: ["openf1-pace", session?.session_key, driverNumber],
    queryFn: ({ signal }) => fetchRacePace(session.session_key, driverNumber, signal),
    enabled: Boolean(session),
    staleTime: 3600000,
    retry: false,
  });

  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h2 className="text-lg font-semibold tracking-tight">Ritmo do vencedor</h2>
      <p className="mb-4 text-xs text-muted-foreground">Piloto #{driverNumber} · tempos por volta da OpenF1 · exclui a largada e voltas de saída dos boxes</p>
      {pace.data?.length ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pace.data}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="lap" domain={["dataMin", "dataMax"]} allowDecimals={false} fontSize={11} />
              <YAxis width={70} domain={["dataMin - 1", "dataMax + 1"]} tickFormatter={formatTime} fontSize={11} />
              <Tooltip labelFormatter={(lap) => `Volta ${lap}`} formatter={(seconds) => [formatTime(Number(seconds)), "Tempo"]}
                contentStyle={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }} />
              <Line type="linear" dataKey="seconds" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p role="status" className="py-5 text-sm text-muted-foreground">
          {sessions.isLoading || pace.isLoading ? "Carregando tempos por volta…" : "Tempos por volta indisponíveis nesta corrida."}
        </p>
      )}
    </section>
  );
}
