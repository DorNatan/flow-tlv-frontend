import { AppLayout } from "@/components/layout/AppLayout";
import { useListParkingZones } from "@/lib/mock-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquareParking, Car, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Parking() {
  const { data: zones, isLoading } = useListParkingZones();
  const { t, dt } = useLanguage();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-mono font-bold text-blue-500 glow-blue uppercase tracking-wider flex items-center gap-2">
          <SquareParking className="w-6 h-6" />
          {t.parking.title}
        </h1>

        {isLoading ? (
          <div className="text-center py-20 font-mono text-muted-foreground animate-pulse">{t.parking.loading}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones?.map((zone) => {
              const occupancyPct = ((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100;
              let statusColor = "bg-green-500";
              let glow = "";
              if (occupancyPct > 95) {
                statusColor = "bg-red-500";
                glow = "glow-red";
              } else if (occupancyPct > 80) {
                statusColor = "bg-orange-500";
                glow = "glow-orange";
              }

              return (
                <Card key={zone.id} className={cn("bg-card border-border/50 overflow-hidden", glow)}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{dt(zone.name)}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">{dt(zone.district)}</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "font-mono text-[9px] uppercase",
                        zone.isOpen ? "border-green-500/50 text-green-500" : "border-red-500/50 text-red-500"
                      )}>
                        {zone.isOpen ? t.parking.open : t.parking.closed}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-muted-foreground">{t.parking.occupancy}</span>
                          <span className="text-foreground">{occupancyPct.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-500", statusColor)} 
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-4">
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
                          <Car className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="font-mono text-sm font-bold text-primary">{zone.availableSpaces}</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{t.parking.avail}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
                          <CircleDollarSign className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="font-mono text-sm font-bold text-blue-400">₪{zone.pricePerHour}</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{t.parking.perHour}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
