import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useListNotifications, useMarkNotificationRead, getListNotificationsQueryKey } from "@/lib/mock-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, TrafficCone, Calendar, Info, SquareParking, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const queryClient = useQueryClient();
  const { data: notifications } = useListNotifications();
  const markRead = useMarkNotificationRead();
  const { t, dir, dt } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'incident': return <AlertCircle className="h-4 w-4" />;
      case 'roadblock': return <TrafficCone className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'parking': return <SquareParking className="h-4 w-4" />;
      case 'alert': return <ShieldAlert className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'text-destructive border-destructive/30 bg-destructive/10';
      case 'warning': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'success': return 'text-green-500 border-green-500/30 bg-green-500/10';
      default: return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    }
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full sm:max-w-md border-l border-primary/20 bg-card p-0 flex flex-col glow-blue">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-mono text-primary uppercase tracking-widest text-lg">{t.notifications.title}</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {notifications?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground font-mono text-sm">
                {t.notifications.empty}
              </div>
            ) : (
              notifications?.map((notif) => (
                <div 
                  key={notif.id}
                  className={cn(
                    "p-4 rounded border flex gap-3 transition-colors cursor-pointer",
                    getSeverityColor(notif.severity),
                    !notif.isRead ? "opacity-100" : "opacity-60 grayscale"
                  )}
                  onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase">{dt(notif.title)}</h4>
                      <span className="text-[10px] opacity-70">
                        {format(new Date(notif.createdAt), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-xs opacity-90">{dt(notif.message)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
