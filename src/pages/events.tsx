import { AppLayout } from "@/components/layout/AppLayout";
import { useListEvents } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Users, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const ImpactColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-500 border-green-500/30",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  severe: "bg-red-500/10 text-red-500 border-red-500/30 pulse-dot",
};

export default function Events() {
  const { data: events, isLoading } = useListEvents();
  const { t, dt } = useLanguage();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-mono font-bold text-primary glow-orange uppercase tracking-wider flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          {t.events.title}
        </h1>

        {isLoading ? (
          <div className="text-center py-20 font-mono text-muted-foreground animate-pulse">{t.events.loading}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((evt) => (
              <Card key={evt.id} className="bg-card/50 border-border/50 hover:bg-card hover:border-primary/50 transition-all group overflow-hidden relative">
                <div className="absolute top-0 start-0 w-1 h-full bg-border group-hover:bg-primary transition-colors" />
                <CardHeader className="pb-3 border-b border-border/30">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold tracking-tight">{dt(evt.title)}</CardTitle>
                    <Badge variant="outline" className="uppercase font-mono text-[10px] ms-2 shrink-0 bg-muted/50">
                      {(t.events.types as Record<string, string>)[evt.type] ?? evt.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{dt(evt.description)}</p>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {t.events.time}</div>
                      <div className="text-foreground" dir="ltr">{format(new Date(evt.startTime), "HH:mm dd/MM")}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.events.venue}</div>
                      <div className="text-foreground truncate" title={dt(evt.venue)}>{dt(evt.venue)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> {t.events.attendance}</div>
                      <div className="text-foreground">{evt.expectedAttendance.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3" /> {t.events.impact}</div>
                      <div>
                        <Badge variant="outline" className={cn("uppercase text-[9px]", ImpactColors[evt.trafficImpact])}>
                          {evt.trafficImpact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {evt.affectedStreets.length > 0 && (
                    <div className="pt-3 border-t border-border/30">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2">{t.events.affectedStreets}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.affectedStreets.map(street => (
                          <span key={street} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            {dt(street)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
