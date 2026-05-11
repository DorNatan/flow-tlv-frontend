import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useListIncidents, useUpdateIncident, getListIncidentsQueryKey } from "@/lib/mock-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, MapPin, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const SeverityColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-500 border-green-500/30",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  critical: "bg-red-500/10 text-red-500 border-red-500/30 pulse-dot",
};

export default function Incidents() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const queryClient = useQueryClient();
  const { t, dt } = useLanguage();

  const { data: incidents, isLoading } = useListIncidents({ 
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    severity: severityFilter !== "all" ? (severityFilter as any) : undefined
  });

  const updateIncident = useUpdateIncident();

  const handleResolve = (id: number) => {
    updateIncident.mutate(
      { id, data: { status: "resolved" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListIncidentsQueryKey() });
        }
      }
    );
  };

  const severityLabel = (s: string) => ({
    critical: t.incidents.critical, high: t.incidents.high, medium: t.incidents.medium, low: t.incidents.low
  } as Record<string, string>)[s] ?? s;

  const statusLabel = (s: string) => ({
    active: t.incidents.active, monitoring: t.incidents.monitoring, resolved: t.incidents.resolved
  } as Record<string, string>)[s] ?? s;

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-mono font-bold text-primary glow-orange uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            {t.incidents.title}
          </h1>

          <div className="flex items-center gap-4">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px] font-mono text-xs uppercase bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.incidents.allSeverities}</SelectItem>
                <SelectItem value="critical">{t.incidents.critical}</SelectItem>
                <SelectItem value="high">{t.incidents.high}</SelectItem>
                <SelectItem value="medium">{t.incidents.medium}</SelectItem>
                <SelectItem value="low">{t.incidents.low}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] font-mono text-xs uppercase bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.incidents.allStatuses}</SelectItem>
                <SelectItem value="active">{t.incidents.active}</SelectItem>
                <SelectItem value="monitoring">{t.incidents.monitoring}</SelectItem>
                <SelectItem value="resolved">{t.incidents.resolved}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 font-mono text-muted-foreground animate-pulse">{t.incidents.loading}</div>
        ) : !incidents?.length ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg text-muted-foreground font-mono">
            {t.incidents.empty}
          </div>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="bg-card/50 border-border/50 hover:bg-card transition-colors glow-blue">
                <CardContent className="p-5 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">{dt(incident.title)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{dt(incident.description)}</p>
                      </div>
                      <Badge variant="outline" className={cn("uppercase font-mono text-[10px] ms-4", SeverityColors[incident.severity])}>
                        {severityLabel(incident.severity)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {dt(incident.street)}, {dt(incident.district)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span dir="ltr">{format(new Date(incident.createdAt), "HH:mm dd/MM/yyyy")}</span>
                      </div>
                      <div className="uppercase border border-border px-2 py-0.5 rounded">
                        {(t.incidents.types as Record<string, string>)[incident.type] ?? incident.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 sm:border-s sm:border-border sm:ps-6 min-w-[120px]">
                    <div className="text-center font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      {t.incidents.statusLabel} <span className="text-foreground">{statusLabel(incident.status)}</span>
                    </div>
                    {incident.status !== "resolved" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs font-mono border-green-500/30 hover:bg-green-500/10 hover:text-green-500"
                        onClick={() => handleResolve(incident.id)}
                        disabled={updateIncident.isPending}
                      >
                        <CheckCircle className="w-3.5 h-3.5 me-2" />
                        {t.incidents.resolve}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
