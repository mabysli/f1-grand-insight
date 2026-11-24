import { useMemo, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import DriverStandings from "@/components/DriverStandings";
import PointsChart from "@/components/PointsChart";
import CircuitComparison from "@/components/CircuitComparison";
import CircuitDetail from "@/components/CircuitDetail";
import TeamComparison from "@/components/TeamComparison";
import HeadToHead from "@/components/HeadToHead";
import { useF1Season, API_SEASONS } from "@/hooks/useF1Season";
import { getSeasonCircuits } from "@/data/season-circuits";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedSeason, setSelectedSeason] = useState(API_SEASONS[0]);
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [selectedCircuit, setSelectedCircuit] = useState("all");

  const { data: season, isLoading, error } = useF1Season(selectedSeason);
  const circuits = useMemo(() => getSeasonCircuits(selectedSeason), [selectedSeason]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="w-full px-4 py-6 space-y-6 sm:px-6 lg:px-8 2xl:px-10">
        <FilterBar
          seasons={API_SEASONS}
          selectedSeason={selectedSeason}
          onSeasonChange={(y) => {
            setSelectedSeason(y);
            setSelectedDriver("all");
            setSelectedCircuit("all");
          }}
          drivers={season?.drivers ?? []}
          selectedDriver={selectedDriver}
          onDriverChange={setSelectedDriver}
          circuits={circuits}
          selectedCircuit={selectedCircuit}
          onCircuitChange={setSelectedCircuit}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-racing text-sm text-muted-foreground tracking-widest">
              CARREGANDO CLASSIFICAÇÕES DE {selectedSeason}...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
            <p className="font-racing text-sm text-destructive tracking-wider">
              ERRO AO CARREGAR CLASSIFICAÇÕES
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {(error as Error).message}
            </p>
          </div>
        )}

        {season && <StatsCards drivers={season.drivers} totalRaces={circuits.length} />}

        <div className={season ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : undefined}>
          {season && (
            <PointsChart
              data={season.pointsProgression}
              drivers={season.drivers}
              selectedDriver={selectedDriver}
            />
          )}
          <CircuitComparison circuits={circuits} selectedCircuit={selectedCircuit} />
        </div>

        <CircuitDetail circuits={circuits} selectedCircuit={selectedCircuit} />

        {season && (
          <>
            <TeamComparison teams={season.teams} />

            <HeadToHead drivers={season.drivers} teams={season.teams} />

            <DriverStandings
              drivers={season.drivers}
              selectedDriver={selectedDriver}
            />
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground font-racing tracking-widest">
          F1 ANALYTICS DASHBOARD · CLASSIFICAÇÕES VIA API-SPORTS · CALENDÁRIO VIA JOLPICA · {selectedSeason}
        </p>
      </footer>
    </div>
  );
};

export default Index;
