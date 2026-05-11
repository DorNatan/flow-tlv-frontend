import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="scan-line" />
      
      <div className="text-center space-y-6 z-10 p-8 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm max-w-md glow-orange">
        <div className="flex justify-center text-primary pulse-dot">
          <AlertCircle className="h-16 w-16" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase text-primary">Error 404</h1>
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Sector Not Found</p>
        </div>
        
        <div className="p-4 bg-muted/30 border border-border rounded text-xs text-left font-mono text-muted-foreground">
          &gt; SYSTEM_ERR: Navigation coordinate unresolved.<br/>
          &gt; SIGNAL_LOSS: Connection to sector severed.<br/>
          &gt; ACTION_REQ: Return to designated operational sector.
        </div>
        
        <Link href="/" className="inline-block mt-4">
          <div className="px-6 py-2 border border-primary/30 text-primary font-mono text-sm uppercase tracking-wider hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer glow-orange">
            Return to Dashboard
          </div>
        </Link>
      </div>
    </div>
  );
}
