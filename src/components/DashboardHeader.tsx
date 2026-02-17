import { Flag } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-racing flex items-center justify-center glow-red">
            <Flag className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-racing font-bold tracking-wider text-foreground">
              F1 <span className="text-gradient-racing">ANALYTICS</span>
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Dashboard de Corridas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-xs text-muted-foreground font-racing">LIVE DATA</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
