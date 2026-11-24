import { Flag } from "lucide-react";

const DashboardHeader = () => (
  <header className="border-b border-border bg-background">
    <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3.5 sm:px-7 lg:px-10">
      <a href="#visao-geral" className="inline-flex items-center gap-3 font-racing text-xl font-bold tracking-tight">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Flag aria-hidden="true" className="size-4" />
        </span>
        F1 Analytics
      </a>
      <nav aria-label="Seções do dashboard" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
        <a className="transition-colors hover:text-foreground" href="#visao-geral">Visão geral</a>
        <a className="transition-colors hover:text-foreground" href="#circuitos">Circuitos</a>
        <a className="transition-colors hover:text-foreground" href="#classificacoes">Classificações</a>
      </nav>
    </div>
  </header>
);

export default DashboardHeader;
