import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import DriverStandings from "@/components/DriverStandings";
import PointsChart from "@/components/PointsChart";
import CircuitComparison from "@/components/CircuitComparison";
import CircuitDetail from "@/components/CircuitDetail";
import TeamComparison from "@/components/TeamComparison";
import RaceResults from "@/components/RaceResults";
import RacePositionChart from "@/components/RacePositionChart";
import { useF1Season, API_SEASONS } from "@/hooks/useF1Season";
import { seasons as fallbackSeasons } from "@/data/f1-data";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedSeason, setSelectedSeason] = useState(2024);
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [selectedCircuit, setSelectedCircuit] = useState("all");

  const { data: season, isLoading, error } = useF1Season(selectedSeason);

  // Fallback lap data from static file (API doesn't provide lap-by-lap)
  const fallback = fallbackSeasons.find((s) => s.year === selectedSeason);
  const raceLaps = fallback?.raceLaps ?? [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
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
          circuits={season?.circuits ?? []}
          selectedCircuit={selectedCircuit}
          onCircuitChange={setSelectedCircuit}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-racing text-sm text-muted-foreground tracking-widest">
              CARREGANDO DADOS DA TEMPORADA {selectedSeason}...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
            <p className="font-racing text-sm text-destructive tracking-wider">
              ERRO AO CARREGAR DADOS
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {(error as Error).message}
            </p>
          </div>
        )}

        {season && !isLoading && (
          <>
            <StatsCards drivers={season.drivers} totalRaces={season.circuits.length} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PointsChart
                data={season.pointsProgression}
                drivers={season.drivers}
                selectedDriver={selectedDriver}
              />
              <CircuitComparison
                circuits={season.circuits}
                selectedCircuit={selectedCircuit}
              />
            </div>

            <CircuitDetail
              circuits={season.circuits}
              selectedCircuit={selectedCircuit}
            />

            <TeamComparison teams={season.teams} />

            {raceLaps.length > 0 && (
              <RacePositionChart
                raceLaps={raceLaps}
                drivers={season.drivers}
              />
            )}

            <DriverStandings
              drivers={season.drivers}
              selectedDriver={selectedDriver}
            />

            <RaceResults
              results={season.results}
              selectedCircuit={selectedCircuit}
              selectedDriver={selectedDriver}
              circuitNames={season.circuits.map((c) => ({ id: c.id, name: c.name }))}
            />
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground font-racing tracking-widest">
          F1 ANALYTICS DASHBOARD · DADOS VIA F1API.DEV · {selectedSeason}
        </p>
      </footer>
    </div>
  );
};

export default Index;
