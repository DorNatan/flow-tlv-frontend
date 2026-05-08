import { Link, useLocation } from "wouter";
import { 
  Map, 
  AlertTriangle, 
  TrafficCone, 
  Calendar, 
  SquareParking, 
  Activity,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export function Sidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.nav.dashboard, icon: Map },
    { href: "/live-map", label: t.nav.liveMap, icon: Radio },
    { href: "/incidents", label: t.nav.incidents, icon: AlertTriangle },
    { href: "/roadblocks", label: t.nav.roadblocks, icon: TrafficCone },
    { href: "/events", label: t.nav.events, icon: Calendar },
    { href: "/parking", label: t.nav.parking, icon: SquareParking },
    { href: "/control", label: t.nav.control, icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex-shrink-0 flex flex-col h-full z-20 relative">
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}tlv-logo.png`}
            alt="Tel Aviv-Yafo"
            className="h-9 w-auto object-contain"
          />
          <div className="flex items-center gap-2 border-s border-border ps-3">
            <div className="font-mono font-bold text-xl tracking-tighter text-primary glow-orange leading-none">Flow</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">TLV</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 glow-orange"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{t.appName}</div>
        <div className="text-[10px] text-muted-foreground/70 leading-tight">{t.appTagline}</div>
      </div>

      <div className="p-4 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
        <span>{t.sidebar.systemStatus}</span>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 pulse-dot" />
          <span className="text-green-500 font-mono">{t.sidebar.online}</span>
        </div>
      </div>
    </aside>
  );
}
