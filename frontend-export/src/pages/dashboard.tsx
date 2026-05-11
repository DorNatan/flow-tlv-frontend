import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  useListIncidents, 
  useListRoadblocks, 
  useGetCongestionData,
  useGetDashboardSummary,
  getListIncidentsQueryKey,
  getListRoadblocksQueryKey,
  getListEventsQueryKey,
  getGetCongestionDataQueryKey,
  getGetDashboardSummaryQueryKey
} from "@/lib/mock-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getIncidentColor = (severity: string) => {
  switch(severity) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#EAB308';
    default: return '#22C55E';
  }
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { t, dir, dt } = useLanguage();

  const { data: summary } = useGetDashboardSummary();
  const { data: incidents } = useListIncidents({ status: "active" });
  const { data: congestion } = useGetCongestionData();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListIncidentsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListRoadblocksQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCongestionDataQueryKey() });
    }, 30000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const center = { lat: 32.0853, lng: 34.7818 };

  const overlaySide = dir === "rtl" ? "right-4" : "left-4";

  return (
    <AppLayout>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={center} 
            zoom={13} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {congestion?.map((point, i) => (
              <CircleMarker
                key={`cong-${i}`}
                center={[point.lat, point.lng]}
                radius={8 + (point.intensity * 10)}
                fillColor={point.intensity > 0.7 ? '#EF4444' : point.intensity > 0.4 ? '#F97316' : '#EAB308'}
                color="transparent"
                fillOpacity={0.4}
              >
                <Popup className="bg-card">
                  <div className="text-xs">
                    <strong>{dt(point.street)}</strong><br/>
                    {t.dashboard.speed}: {point.speed}km/h ({t.dashboard.freeFlow}: {point.freeFlowSpeed}km/h)<br/>
                    {t.dashboard.intensity}: {(point.intensity * 100).toFixed(0)}%
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {incidents?.map(incident => (
              <CircleMarker
                key={`inc-${incident.id}`}
                center={[incident.lat, incident.lng]}
                radius={6}
                fillColor={getIncidentColor(incident.severity)}
                color={getIncidentColor(incident.severity)}
                weight={2}
                fillOpacity={1}
                className={incident.severity === 'critical' ? 'pulse-dot' : ''}
              >
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-sm mb-1">{dt(incident.title)}</h3>
                    <p className="text-xs text-muted-foreground">{dt(incident.description)}</p>
                    <Badge variant="outline" className="mt-2 capitalize text-[10px]">{incident.severity}</Badge>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          </MapContainer>
        </div>

        <div className={`absolute top-4 ${overlaySide} z-10 w-80 space-y-4 pointer-events-none`}>
          
          <Card className="map-overlay-panel pointer-events-auto glow-orange">
            <CardContent className="p-4">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.dashboard.cityPulse}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-mono text-primary font-bold">{summary?.activeIncidents || 0}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{t.dashboard.activeIncidents}</div>
                </div>
                <div>
                  <div className="text-3xl font-mono text-destructive font-bold">{summary?.criticalIncidents || 0}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{t.dashboard.critical}</div>
                </div>
                <div>
                  <div className="text-3xl font-mono text-blue-400 font-bold">{summary?.activeRoadblocks || 0}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{t.dashboard.roadblocks}</div>
                </div>
                <div>
                  <div className="text-3xl font-mono text-green-400 font-bold">
                    {summary ? ((summary.availableParkingSpaces / summary.totalParkingSpaces) * 100).toFixed(0) : 0}%
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">{t.dashboard.parkingAvail}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="map-overlay-panel pointer-events-auto">
            <CardContent className="p-4">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.dashboard.congestionLevel}</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm capitalize">{summary?.congestionLevel || t.dashboard.unknown}</span>
                <span className="font-mono text-sm">{summary?.avgCongestionScore || 0}/100</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${summary?.avgCongestionScore || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
