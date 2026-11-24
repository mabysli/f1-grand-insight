import { useMemo, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import DriverStandings from "@/components/DriverStandings";
import PointsChart from "@/components/PointsChart";
import CircuitComparison from "@/components/CircuitComparison";
import RacePaceChart from "@/components/RacePaceChart";
import CircuitDetail from "@/components/CircuitDetail";
import TeamComparison from "@/components/TeamComparison";
import HeadToHead from "@/components/HeadToHead";
import { useF1Season, API_SEASONS } from "@/hooks/useF1Season";
import { getSeasonCircuits } from "@/data/season-circuits";
import { ArrowDownRight } from "lucide-react";

const Index = () => {
  const [selectedSeason, setSelectedSeason] = useState(API_SEASONS[0]);
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [selectedCircuit, setSelectedCircuit] = useState("all");

  const { data: season, isLoading } = useF1Season(selectedSeason);
  const localCircuits = useMemo(() => getSeasonCircuits(selectedSeason), [selectedSeason]);
  const circuits = season?.circuits ?? localCircuits;

  const featuredCircuit = circuits.find((circuit) => circuit.id === selectedCircuit) ?? circuits[0];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-[1480px] space-y-7 px-4 pb-12 pt-5 sm:px-7 lg:px-10">
        <section id="visao-geral" className="season-hero relative isolate grid min-w-0 gap-7 overflow-hidden rounded-3xl border border-border px-6 py-8 sm:p-10 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:min-h-[340px]">
          <div className="min-w-0">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Temporada {selectedSeason}
            </p>
            <h1 className="max-w-[13ch] text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Fórmula 1 em dados
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Compare circuitos, pilotos e equipes da temporada.
            </p>
            <a href="#circuitos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85">
              Explorar circuitos
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          {featuredCircuit?.trackPath && (
            <figure className="relative min-w-0 rounded-2xl border border-white/10 bg-background/35 px-4 pb-4 pt-2 sm:px-6">
              <svg viewBox="0 0 240 160" aria-hidden="true" className="mx-auto h-36 w-full max-w-[340px] text-primary sm:h-44 md:h-52">
                <path d={featuredCircuit.trackPath} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="8" strokeLinejoin="round" />
                <path d={featuredCircuit.trackPath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-white/10 pt-3">
                <span className="text-sm font-semibold">{featuredCircuit.trackName}</span>
                <span className="font-mono text-xs text-muted-foreground">{featuredCircuit.length}</span>
              </figcaption>
            </figure>
          )}
        </section>
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

        {season?.snapshotDate && (
          <p role="status" className="text-xs text-muted-foreground">
            Dados da última verificação em {new Date(`${season.snapshotDate}T12:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC" })}.
          </p>
        )}

        {season && <StatsCards drivers={season.drivers} totalRaces={circuits.filter((circuit) => circuit.completed ?? circuit.laps > 0).length} />}

        <div className={season?.pointsProgression.length ? "grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2" : "min-w-0"}>
          {Boolean(season?.pointsProgression.length) && (
            <PointsChart
              data={season.pointsProgression}
              drivers={season.drivers}
              selectedDriver={selectedDriver}
            />
          )}
          <CircuitComparison circuits={circuits} selectedCircuit={selectedCircuit} />
        </div>

        {season?.detailedResults === false && (
          <p role="status" className="text-sm text-muted-foreground">Resultados completos temporariamente indisponíveis. A classificação publicada continua visível.</p>
        )}

        {selectedCircuit !== "all" && selectedSeason >= 2023 && featuredCircuit?.date && featuredCircuit.winnerNumber != null && (
          <RacePaceChart year={selectedSeason} date={featuredCircuit.date} driverNumber={featuredCircuit.winnerNumber} />
        )}

        <section id="circuitos" aria-label="Circuitos da temporada">
          <CircuitDetail circuits={circuits} selectedCircuit={selectedCircuit} />
        </section>

        <section id="classificacoes" aria-label="Classificações" className="space-y-7">
          {season && (
            <>
              <TeamComparison teams={season.teams} showRaceStats={season.detailedResults} />
              {season.detailedResults && <HeadToHead drivers={season.drivers} teams={season.teams} />}
              <DriverStandings drivers={season.drivers} selectedDriver={selectedDriver} showRaceStats={season.detailedResults} />
            </>
          )}
          {!season && (
            <p className="text-sm text-muted-foreground" role="status">
              {isLoading ? "Carregando classificações…" : "Classificações indisponíveis no momento."}
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <p className="px-4 text-center font-mono text-xs text-muted-foreground">
          F1 ANALYTICS DASHBOARD · JOLPICA F1 · OPENF1 · {selectedSeason}
        </p>
      </footer>
    </div>
  );
};

export default Index;
