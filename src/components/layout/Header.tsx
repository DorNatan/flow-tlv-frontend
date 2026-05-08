import { Bell, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListNotifications } from "@/lib/mock-api";
import { NotificationsPanel } from "../NotificationsPanel";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export function Header() {
  const [panelOpen, setPanelOpen] = useState(false);
  const { data: notifications } = useListNotifications({ unread: true });
  const { t, toggleLang } = useLanguage();

  const unreadCount = notifications?.length || 0;

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold uppercase tracking-wider font-mono">{t.header.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 hover:bg-primary/10 hover:text-primary font-mono text-xs gap-2"
          onClick={toggleLang}
        >
          <Languages className="h-4 w-4" />
          {t.header.switchLang}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-primary/30 hover:bg-primary/10 hover:text-primary glow-orange"
          onClick={() => setPanelOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground pulse-dot">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      <NotificationsPanel open={panelOpen} onOpenChange={setPanelOpen} />
    </header>
  );
}
