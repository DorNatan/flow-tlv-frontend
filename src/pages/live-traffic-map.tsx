import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { AlertTriangle, Construction, Calendar, Ban, MapPin, Activity, Radio } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";

interface TrafficEvent {
  id: string;
  type: "roadwork" | "accident" | "event" | "closure";
  title: string;
  street: string;
  description: string;
  severity: Severity;
  lat: number;
  lng: number;
  startedAt: string;
}

const EVENTS: TrafficEvent[] = [
  {
    id: "evt-1",
    type: "roadwork",
    title: "Road work on Namir Road",
    street: "Namir Road",
    description: "Lane closure for utility maintenance. Expect 15-20 min delays northbound.",
    severity: "medium",
    lat: 32.1108,
    lng: 34.8044,
    startedAt: "07:42",
  },
  {
    id: "evt-2",
    type: "accident",
    title: "Accident on Ibn Gabirol",
    street: "Ibn Gabirol St",
    description: "Two-vehicle collision near Rabin Square. Right lane blocked, emergency services on scene.",
    severity: "critical",
    lat: 32.0833,
    lng: 34.7796,
    startedAt: "08:15",
  },
  {
    id: "evt-3",
    type: "event",
    title: "Event impact near Park Hayarkon",
    street: "Rokach Blvd",
    description: "Outdoor concert drawing heavy crowds. Increased congestion expected until 23:00.",
    severity: "high",
    lat: 32.1024,
    lng: 34.8076,
    startedAt: "18:00",
  },
  {
    id: "evt-4",
    type: "closure",
    title: "Road closure near Allenby",
    street: "Allenby St",
    description: "Full closure between Rothschild and Magen David Square for infrastructure work.",
    severity: "high",
    lat: 32.0691,
    lng: 34.7702,
    startedAt: "06:00",
  },
];

const SEVERITY_HEX: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const SEVERITY_BORDER: Record<Severity, string> = {
  critical: "border-red-500/60 text-red-400",
  high: "border-orange-500/60 text-orange-400",
  medium: "border-yellow-500/60 text-yellow-400",
  low: "border-green-500/60 text-green-400",
};

const TYPE_ICON = {
  roadwork: Construction,
  accident: AlertTriangle,
  event: Calendar,
  closure: Ban,
} as const;

// Dark smart-city Google Maps style
const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7a8aa3" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a3b3cc" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#5a6b85" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0f2a1a" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#4f8a6a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2336" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0b1220" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#243049" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#0b1220" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a2336" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#7a8aa3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#06101f" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3b5378" }] },
];

const TLV_CENTER = { lat: 32.0853, lng: 34.7818 };
// Counter-clockwise winding so it acts as a hole in the mask polygon
const TLV_OUTLINE: google.maps.LatLngLiteral[] = [
  { lat: 32.1280, lng: 34.7700 }, { lat: 32.1130, lng: 34.7660 }, { lat: 32.0900, lng: 34.7560 },
  { lat: 32.0680, lng: 34.7460 }, { lat: 32.0500, lng: 34.7460 }, { lat: 32.0430, lng: 34.7600 },
  { lat: 32.0540, lng: 34.7820 }, { lat: 32.0680, lng: 34.7900 }, { lat: 32.0790, lng: 34.7960 },
  { lat: 32.0880, lng: 34.8060 }, { lat: 32.0980, lng: 34.8230 }, { lat: 32.1080, lng: 34.8360 },
  { lat: 32.1180, lng: 34.8330 }, { lat: 32.1280, lng: 34.8030 }, { lat: 32.1330, lng: 34.7850 },
  { lat: 32.1365, lng: 34.7720 },
];
// Clockwise outer ring covering the broader area shown on screen
const WORLD_RING: google.maps.LatLngLiteral[] = [
  { lat: 31.5, lng: 34.0 }, { lat: 32.7, lng: 34.0 }, { lat: 32.7, lng: 35.5 }, { lat: 31.5, lng: 35.5 },
];
const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";

function buildMarkerSvg(hex: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='38' height='48' viewBox='0 0 38 48'>
    <defs>
      <filter id='g' x='-50%' y='-50%' width='200%' height='200%'>
        <feGaussianBlur stdDeviation='3' result='b'/>
        <feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter>
    </defs>
    <path d='M19 2 C9 2 2 9 2 19 c0 12 17 27 17 27 s17-15 17-27 C36 9 29 2 19 2 z' fill='${hex}' opacity='0.95' filter='url(#g)'/>
    <circle cx='19' cy='19' r='6' fill='#0b1220'/>
    <circle cx='19' cy='19' r='3' fill='${hex}'/>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

export default function LiveTrafficMap() {
  const { t } = useLanguage();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing-key" | "error">(
    API_KEY ? "loading" : "missing-key"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!API_KEY || !mapDivRef.current) return;

    let cancelled = false;
    setOptions({ key: API_KEY, v: "weekly" });

    (async () => {
      try {
        const [{ Map, InfoWindow, TrafficLayer }, { Marker }, { Size, Point }] = await Promise.all([
          importLibrary("maps"),
          importLibrary("marker"),
          importLibrary("core"),
        ]);

        if (cancelled || !mapDivRef.current) return;

        const map = new Map(mapDivRef.current, {
          center: TLV_CENTER,
          zoom: 13,
          minZoom: 13,
          maxZoom: 17,
          restriction: {
            latLngBounds: { north: 32.140, south: 32.040, west: 34.745, east: 34.840 },
            strictBounds: true,
          },
          styles: DARK_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: "#0b1220",
          gestureHandling: "greedy",
        });
        mapRef.current = map;

        new TrafficLayer().setMap(map);

        const { Polygon } = await importLibrary("maps");
        new Polygon({
          paths: [WORLD_RING, TLV_OUTLINE],
          strokeOpacity: 0,
          fillColor: "#0b1220",
          fillOpacity: 0.88,
          clickable: false,
          zIndex: 1,
          map,
        });
        new Polygon({
          paths: TLV_OUTLINE,
          strokeColor: "#f97316",
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillOpacity: 0,
          clickable: false,
          zIndex: 2,
          map,
        });

        infoRef.current = new InfoWindow();

        EVENTS.forEach((evt) => {
          const marker = new Marker({
            position: { lat: evt.lat, lng: evt.lng },
            map,
            title: evt.title,
            icon: {
              url: buildMarkerSvg(SEVERITY_HEX[evt.severity]),
              scaledSize: new Size(38, 48),
              anchor: new Point(19, 46),
            },
            optimized: false,
          });

          marker.addListener("click", () => focusEvent(evt.id));
          markersRef.current.set(evt.id, marker);
        });

        setStatus("ready");
      } catch (err: unknown) {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
      infoRef.current?.close();
    };
  }, []);

  const focusEvent = (id: string) => {
    const evt = EVENTS.find((e) => e.id === id);
    const marker = markersRef.current.get(id);
    if (!evt || !marker || !mapRef.current || !infoRef.current) return;

    setActiveId(id);
    mapRef.current.panTo({ lat: evt.lat, lng: evt.lng });
    if ((mapRef.current.getZoom() ?? 13) < 15) mapRef.current.setZoom(15);

    infoRef.current.setContent(`
      <div style="font-family:system-ui,sans-serif;color:#0b1220;min-width:200px">
        <div style="font-weight:700;font-size:13px;margin-bottom:4px">${evt.title}</div>
        <div style="font-size:11px;color:#475569;margin-bottom:6px">${evt.street}</div>
        <div style="font-size:11px;line-height:1.4">${evt.description}</div>
      </div>
    `);
    infoRef.current.open({ map: mapRef.current, anchor: marker });
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Map */}
        <div className="flex-1 relative bg-[#0b1220] min-w-0">
          {/* Top overlay banner */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur-md border border-border/60 rounded-sm pointer-events-auto">
              <Radio className="h-4 w-4 text-primary animate-pulse" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono leading-none">
                  {t.liveMap.live}
                </div>
                <div className="text-sm font-bold leading-tight">{t.liveMap.title}</div>
              </div>
            </div>
            <div className="px-3 py-2 bg-card/90 backdrop-blur-md border border-border/60 rounded-sm font-mono text-[10px] uppercase tracking-widest text-muted-foreground pointer-events-auto">
              <span className="text-primary">●</span> {t.liveMap.trafficLayer}
            </div>
          </div>

          <div ref={mapDivRef} className="absolute inset-0" />

          {/* Status overlays */}
          {status === "missing-key" && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="max-w-md bg-card border border-border rounded-sm p-6 text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{t.liveMap.keyMissingTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.liveMap.keyMissingDesc}</p>
              </div>
            </div>
          )}
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {t.liveMap.loading}
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="max-w-md bg-card border border-red-500/40 rounded-sm p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{t.liveMap.errorTitle}</h3>
                <p className="text-xs text-muted-foreground font-mono break-all">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-md border border-border/60 rounded-sm px-3 py-2">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">
              {t.liveMap.legend}
            </div>
            <div className="flex gap-3 text-[10px] font-mono">
              {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: SEVERITY_HEX[s], boxShadow: `0 0 6px ${SEVERITY_HEX[s]}` }}
                  />
                  <span className="uppercase text-muted-foreground">{t.liveMap.severity[s]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-s border-border bg-sidebar flex-shrink-0 flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider">{t.liveMap.activeEvents}</h2>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              {EVENTS.length} {t.liveMap.eventsTracked}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {EVENTS.map((evt) => {
              const Icon = TYPE_ICON[evt.type];
              const isActive = activeId === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => focusEvent(evt.id)}
                  className={cn(
                    "w-full text-left p-4 transition-all hover:bg-accent/30 group",
                    isActive && "bg-primary/5 border-s-2 border-primary"
                  )}
                  data-testid={`event-${evt.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-sm border flex items-center justify-center flex-shrink-0",
                        SEVERITY_BORDER[evt.severity]
                      )}
                      style={{ backgroundColor: SEVERITY_HEX[evt.severity] + "11" }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-bold leading-tight">{evt.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground mb-1.5">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{evt.street}</span>
                        <span>·</span>
                        <span dir="ltr">{evt.startedAt}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{evt.description}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={cn("uppercase font-mono text-[9px]", SEVERITY_BORDER[evt.severity])}>
                          {t.liveMap.severity[evt.severity]}
                        </Badge>
                        <Badge variant="outline" className="uppercase font-mono text-[9px] text-muted-foreground border-border/60">
                          {t.liveMap.types[evt.type]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-border bg-card/30">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-muted-foreground">{t.liveMap.dataSource}</span>
              <span className="flex items-center gap-1.5 text-green-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {t.liveMap.connected}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
