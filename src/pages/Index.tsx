import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import DriverStandings from "@/components/DriverStandings";
import PointsChart from "@/components/PointsChart";
import CircuitComparison from "@/components/CircuitComparison";
import RaceResults from "@/components/RaceResults";
import { getSeasonYears, getSeasonData } from "@/data/f1-data";

const Index = () => {
  const years = getSeasonYears();
  const [selectedSeason, setSelectedSeason] = useState(years[0]);
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [selectedCircuit, setSelectedCircuit] = useState("all");

  const season = getSeasonData(selectedSeason);

  if (!season) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <FilterBar
          seasons={years}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
          drivers={season.drivers}
          selectedDriver={selectedDriver}
          onDriverChange={setSelectedDriver}
          circuits={season.circuits}
          selectedCircuit={selectedCircuit}
          onCircuitChange={setSelectedCircuit}
        />

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
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground font-racing tracking-widest">
          F1 ANALYTICS DASHBOARD · DADOS SIMULADOS · 2024
        </p>
      </footer>
    </div>
  );
};

export default Index;
