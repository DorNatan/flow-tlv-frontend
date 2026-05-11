import { AppLayout } from "@/components/layout/AppLayout";
import { useGetTrafficFlow, useGetDashboardSummary, useGetLiveIncidentFeed } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Control() {
  const { data: flowData } = useGetTrafficFlow();
  const { data: summary } = useGetDashboardSummary();
  const { data: feed } = useGetLiveIncidentFeed();
  const { t, dt } = useLanguage();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-mono font-bold text-primary glow-orange uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-6 h-6" />
          {t.control.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-primary/20 glow-orange">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded text-primary"><Activity className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-mono font-bold">{summary?.avgCongestionScore || 0}/100</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.control.cityCongestion}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-destructive/20 glow-red">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded text-destructive"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-mono font-bold">{summary?.criticalIncidents || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.control.criticalIncidents}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-blue-500/20 glow-blue">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded text-blue-500"><TrendingUp className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-mono font-bold">{summary?.activeRoadblocks || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.control.activeRoadblocks}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded text-green-500"><Activity className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-mono font-bold">{summary?.activeIncidents || 0}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.control.totalActiveIssues}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">{t.control.trafficVolume}</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#3B82F6' }}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">{t.control.congestionIndex}</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#F97316' }}
                    />
                    <Line type="step" dataKey="congestionIndex" stroke="#F97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1">
            <Card className="bg-card/50 border-border/50 h-full">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-sm font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
                  {t.control.liveActionFeed}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[550px]">
                <div className="divide-y divide-border/50">
                  {feed?.map((entry) => (
                    <div key={entry.id} className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-xs font-bold uppercase text-foreground">{dt(entry.title)}</span>
                        <span className="text-[9px] text-muted-foreground font-mono" dir="ltr">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{dt(entry.description)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border border-border text-muted-foreground">{entry.entityType}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-muted/50 text-foreground">{entry.action}</span>
                      </div>
                    </div>
                  ))}
                  {!feed?.length && (
                    <div className="p-8 text-center text-muted-foreground font-mono text-sm">
                      {t.control.noActivity}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
