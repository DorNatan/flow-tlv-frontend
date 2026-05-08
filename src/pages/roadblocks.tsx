import { AppLayout } from "@/components/layout/AppLayout";
import { useListRoadblocks, useUpdateRoadblock, getListRoadblocksQueryKey } from "@/lib/mock-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { TrafficCone, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Roadblocks() {
  const queryClient = useQueryClient();
  const { data: roadblocks, isLoading } = useListRoadblocks();
  const updateRoadblock = useUpdateRoadblock();
  const { t, dir, dt } = useLanguage();

  const handleToggle = (id: number, currentStatus: boolean) => {
    updateRoadblock.mutate(
      { id, data: { isActive: !currentStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRoadblocksQueryKey() });
        }
      }
    );
  };

  const arrow = dir === "rtl" ? "←" : "→";

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-mono font-bold text-blue-500 glow-blue uppercase tracking-wider flex items-center gap-2">
            <TrafficCone className="w-6 h-6" />
            {t.roadblocks.title}
          </h1>
        </div>

        <div className="rounded-md border border-border bg-card/50 overflow-hidden glow-blue">
          <Table>
            <TableHeader className="bg-card font-mono text-xs uppercase text-muted-foreground">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>{t.roadblocks.location}</TableHead>
                <TableHead>{t.roadblocks.reason}</TableHead>
                <TableHead>{t.roadblocks.time}</TableHead>
                <TableHead>{t.roadblocks.status}</TableHead>
                <TableHead className="text-end">{t.roadblocks.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-mono text-muted-foreground">{t.roadblocks.loading}</TableCell>
                </TableRow>
              ) : !roadblocks?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-mono text-muted-foreground">{t.roadblocks.empty}</TableCell>
                </TableRow>
              ) : (
                roadblocks.map((block) => (
                  <TableRow key={block.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <div className="font-bold text-sm">{dt(block.street)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {dt(block.fromStreet)} {arrow} {dt(block.toStreet)}
                        <span className="ms-2 uppercase px-1.5 py-0.5 border border-border/50 rounded font-mono text-[9px]">{dt(block.district)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{dt(block.reason)}</div>
                      <div className="text-xs text-primary font-mono uppercase mt-0.5">{(t.roadblocks.types as Record<string, string>)[block.type] ?? block.type}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <div>{t.roadblocks.start}: <span dir="ltr">{format(new Date(block.startTime), "HH:mm dd/MM")}</span></div>
                      {block.endTime && <div>{t.roadblocks.end}: <span dir="ltr">{format(new Date(block.endTime), "HH:mm dd/MM")}</span></div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "uppercase font-mono text-[10px]",
                        block.isActive ? "bg-red-500/10 text-red-500 border-red-500/30 pulse-dot" : "bg-muted text-muted-foreground"
                      )}>
                        {block.isActive ? t.roadblocks.active : t.roadblocks.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "font-mono text-xs uppercase tracking-wider",
                          block.isActive 
                            ? "border-primary/30 text-primary hover:bg-primary/10" 
                            : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                        )}
                        onClick={() => handleToggle(block.id, block.isActive)}
                        disabled={updateRoadblock.isPending}
                      >
                        {block.isActive ? <PowerOff className="w-3.5 h-3.5 me-2" /> : <Power className="w-3.5 h-3.5 me-2" />}
                        {block.isActive ? t.roadblocks.deactivate : t.roadblocks.activate}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
