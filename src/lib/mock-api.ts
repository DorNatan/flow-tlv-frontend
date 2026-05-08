import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "active" | "monitoring" | "resolved";
export type IncidentType =
  | "accident"
  | "congestion"
  | "roadwork"
  | "flood"
  | "fire"
  | "police"
  | "other";

export interface Incident {
  id: number;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  street: string;
  district: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export type RoadblockType =
  | "construction"
  | "accident"
  | "event"
  | "emergency"
  | "maintenance"
  | "other";

export interface Roadblock {
  id: number;
  street: string;
  fromStreet: string;
  toStreet: string;
  district: string;
  reason: string;
  type: RoadblockType;
  isActive: boolean;
  startTime: string;
  endTime?: string | null;
}

export type CityEventType =
  | "marathon"
  | "concert"
  | "protest"
  | "festival"
  | "sports"
  | "political"
  | "other";

export type CityEventTrafficImpact = "low" | "medium" | "high" | "severe";

export interface CityEvent {
  id: number;
  title: string;
  description: string;
  type: CityEventType;
  venue: string;
  district: string;
  expectedAttendance: number;
  trafficImpact: CityEventTrafficImpact;
  affectedStreets: string[];
  startTime: string;
  endTime: string;
}

export type ParkingZoneType = "street" | "garage" | "lot" | "underground";

export interface ParkingZone {
  id: number;
  name: string;
  district: string;
  totalSpaces: number;
  availableSpaces: number;
  type: ParkingZoneType;
  pricePerHour: number;
  isOpen: boolean;
}

export type NotificationType =
  | "incident"
  | "roadblock"
  | "event"
  | "parking"
  | "system"
  | "alert";

export type NotificationSeverity = "info" | "warning" | "danger" | "success";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  activeIncidents: number;
  criticalIncidents: number;
  activeRoadblocks: number;
  upcomingEvents: number;
  totalParkingSpaces: number;
  availableParkingSpaces: number;
  unreadNotifications: number;
  congestionLevel: "low" | "moderate" | "heavy" | "severe";
  avgCongestionScore: number;
  incidentsByType: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
}

export interface CongestionPoint {
  lat: number;
  lng: number;
  intensity: number;
  street: string;
  speed: number;
  freeFlowSpeed: number;
}

export type FeedEntryEntityType =
  | "incident"
  | "roadblock"
  | "event"
  | "parking"
  | "notification";
export type FeedEntryAction =
  | "created"
  | "updated"
  | "resolved"
  | "closed"
  | "opened";

export interface FeedEntry {
  id: number;
  entityType: FeedEntryEntityType;
  entityId: number;
  action: FeedEntryAction;
  title: string;
  description: string;
  severity?: string | null;
  district?: string | null;
  timestamp: string;
}

export interface TrafficFlowPoint {
  hour: string;
  volume: number;
  avgSpeed: number;
  congestionIndex: number;
}

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(now + h * 3_600_000).toISOString();

const incidents: Incident[] = [
  {
    id: 1,
    title: "Multi-vehicle collision",
    description: "3-car accident blocking right lane near Azrieli interchange",
    type: "accident",
    severity: "critical",
    status: "active",
    street: "Ayalon Highway S",
    district: "Tel Aviv Center",
    lat: 32.0744,
    lng: 34.7918,
    createdAt: minutesAgo(8),
  },
  {
    id: 2,
    title: "Heavy congestion building",
    description: "Slow traffic southbound, average speed 12 km/h",
    type: "congestion",
    severity: "high",
    status: "active",
    street: "Namir Rd",
    district: "North Tel Aviv",
    lat: 32.1108,
    lng: 34.8044,
    createdAt: minutesAgo(22),
  },
  {
    id: 3,
    title: "Fender bender",
    description: "Minor collision, vehicles pulled to shoulder",
    type: "accident",
    severity: "low",
    status: "monitoring",
    street: "Dizengoff St",
    district: "Tel Aviv Center",
    lat: 32.0808,
    lng: 34.7738,
    createdAt: minutesAgo(45),
  },
  {
    id: 4,
    title: "Road resurfacing",
    description: "Lane closure for asphalt work, expect delays",
    type: "roadwork",
    severity: "medium",
    status: "active",
    street: "Derech Menachem Begin",
    district: "Tel Aviv Center",
    lat: 32.075,
    lng: 34.7896,
    createdAt: hoursAgo(2),
  },
  {
    id: 5,
    title: "Police checkpoint",
    description: "Security inspection causing slowdown",
    type: "police",
    severity: "medium",
    status: "active",
    street: "Jabotinsky St",
    district: "Ramat Gan",
    lat: 32.0838,
    lng: 34.8072,
    createdAt: minutesAgo(15),
  },
  {
    id: 6,
    title: "Localized flooding",
    description: "Standing water in roadway after morning rain",
    type: "flood",
    severity: "high",
    status: "monitoring",
    street: "Yehuda Halevi St",
    district: "Tel Aviv Center",
    lat: 32.064,
    lng: 34.7762,
    createdAt: hoursAgo(1),
  },
  {
    id: 7,
    title: "Vehicle breakdown cleared",
    description: "Lane reopened, traffic returning to normal",
    type: "other",
    severity: "low",
    status: "resolved",
    street: "Rothschild Blvd",
    district: "Tel Aviv Center",
    lat: 32.0654,
    lng: 34.7727,
    createdAt: hoursAgo(3),
  },
];

const roadblocks: Roadblock[] = [
  {
    id: 1,
    street: "Allenby St",
    fromStreet: "Rothschild Blvd",
    toStreet: "Magen David Square",
    district: "Tel Aviv Center",
    reason: "Infrastructure replacement work",
    type: "construction",
    isActive: true,
    startTime: hoursAgo(6),
    endTime: hoursAhead(8),
  },
  {
    id: 2,
    street: "Rokach Blvd",
    fromStreet: "Namir Rd",
    toStreet: "Park Hayarkon",
    district: "North Tel Aviv",
    reason: "Concert event setup",
    type: "event",
    isActive: true,
    startTime: hoursAgo(2),
    endTime: hoursAhead(6),
  },
  {
    id: 3,
    street: "Ahad Ha'am St",
    fromStreet: "Sheinkin",
    toStreet: "Nahalat Binyamin",
    district: "Tel Aviv Center",
    reason: "Water main repair",
    type: "maintenance",
    isActive: true,
    startTime: hoursAgo(4),
    endTime: hoursAhead(2),
  },
  {
    id: 4,
    street: "Petah Tikva Rd",
    fromStreet: "Hashalom Interchange",
    toStreet: "Arlozorov St",
    district: "Tel Aviv Center",
    reason: "Accident cleanup completed",
    type: "accident",
    isActive: false,
    startTime: hoursAgo(8),
    endTime: hoursAgo(1),
  },
  {
    id: 5,
    street: "Ibn Gvirol St",
    fromStreet: "Rabin Square",
    toStreet: "Arlozorov St",
    district: "Tel Aviv Center",
    reason: "Emergency utility repair",
    type: "emergency",
    isActive: true,
    startTime: minutesAgo(40),
    endTime: hoursAhead(3),
  },
];

const events: CityEvent[] = [
  {
    id: 1,
    title: "Tel Aviv Night Run",
    description: "Annual 10K night run through central Tel Aviv streets",
    type: "marathon",
    venue: "Park Hayarkon",
    district: "North Tel Aviv",
    expectedAttendance: 8000,
    trafficImpact: "high",
    affectedStreets: ["Rokach Blvd", "Namir Rd", "Ibn Gvirol St"],
    startTime: hoursAhead(4),
    endTime: hoursAhead(7),
  },
  {
    id: 2,
    title: "Hayarkon Open-Air Concert",
    description: "Outdoor concert with major Israeli artists",
    type: "concert",
    venue: "Hayarkon Park Amphitheater",
    district: "North Tel Aviv",
    expectedAttendance: 25000,
    trafficImpact: "severe",
    affectedStreets: ["Rokach Blvd", "Haim Levanon St"],
    startTime: hoursAhead(6),
    endTime: hoursAhead(11),
  },
  {
    id: 3,
    title: "Pride Week Rally",
    description: "Annual Pride march along main Tel Aviv boulevards",
    type: "festival",
    venue: "Meir Park",
    district: "Tel Aviv Center",
    expectedAttendance: 50000,
    trafficImpact: "severe",
    affectedStreets: ["Bograshov St", "Dizengoff St", "Frishman St"],
    startTime: hoursAhead(28),
    endTime: hoursAhead(34),
  },
  {
    id: 4,
    title: "Maccabi Tel Aviv Match",
    description: "Euroleague basketball game with international visitors",
    type: "sports",
    venue: "Menora Mivtachim Arena",
    district: "Tel Aviv South",
    expectedAttendance: 11000,
    trafficImpact: "medium",
    affectedStreets: ["Yigal Alon St", "Derech Menachem Begin"],
    startTime: hoursAhead(48),
    endTime: hoursAhead(52),
  },
  {
    id: 5,
    title: "Climate Action Demonstration",
    description: "Organized protest moving from Habima Square to Rabin Square",
    type: "protest",
    venue: "Habima Square",
    district: "Tel Aviv Center",
    expectedAttendance: 4000,
    trafficImpact: "medium",
    affectedStreets: ["Tarsat Blvd", "Ibn Gvirol St"],
    startTime: hoursAhead(20),
    endTime: hoursAhead(23),
  },
  {
    id: 6,
    title: "Jaffa Food Festival",
    description: "Multi-day culinary festival in Old Jaffa",
    type: "festival",
    venue: "Old Jaffa Port",
    district: "Jaffa",
    expectedAttendance: 15000,
    trafficImpact: "high",
    affectedStreets: ["Yefet St", "Mifratz Shlomo Promenade"],
    startTime: hoursAhead(72),
    endTime: hoursAhead(120),
  },
];

const parkingZones: ParkingZone[] = [
  {
    id: 1,
    name: "Azrieli Center Garage",
    district: "Tel Aviv Center",
    totalSpaces: 1200,
    availableSpaces: 84,
    type: "garage",
    pricePerHour: 18,
    isOpen: true,
  },
  {
    id: 2,
    name: "Dizengoff Center",
    district: "Tel Aviv Center",
    totalSpaces: 800,
    availableSpaces: 256,
    type: "underground",
    pricePerHour: 15,
    isOpen: true,
  },
  {
    id: 3,
    name: "Sarona Market",
    district: "Tel Aviv Center",
    totalSpaces: 450,
    availableSpaces: 12,
    type: "underground",
    pricePerHour: 20,
    isOpen: true,
  },
  {
    id: 4,
    name: "Tel Aviv Port Lot",
    district: "North Tel Aviv",
    totalSpaces: 600,
    availableSpaces: 320,
    type: "lot",
    pricePerHour: 12,
    isOpen: true,
  },
  {
    id: 5,
    name: "Old Jaffa Garage",
    district: "Jaffa",
    totalSpaces: 280,
    availableSpaces: 110,
    type: "garage",
    pricePerHour: 10,
    isOpen: true,
  },
  {
    id: 6,
    name: "Ramat Gan Diamond Exchange",
    district: "Ramat Gan",
    totalSpaces: 950,
    availableSpaces: 380,
    type: "underground",
    pricePerHour: 14,
    isOpen: true,
  },
  {
    id: 7,
    name: "Hayarkon Park North",
    district: "North Tel Aviv",
    totalSpaces: 200,
    availableSpaces: 0,
    type: "lot",
    pricePerHour: 8,
    isOpen: true,
  },
  {
    id: 8,
    name: "Carmel Market Underground",
    district: "Tel Aviv Center",
    totalSpaces: 320,
    availableSpaces: 45,
    type: "underground",
    pricePerHour: 16,
    isOpen: false,
  },
];

const notifications: Notification[] = [
  {
    id: 1,
    title: "Critical incident reported",
    message: "Multi-vehicle collision on Ayalon Highway S — emergency response dispatched",
    type: "incident",
    severity: "danger",
    isRead: false,
    createdAt: minutesAgo(8),
  },
  {
    id: 2,
    title: "New roadblock activated",
    message: "Ibn Gvirol St closed for emergency utility repair",
    type: "roadblock",
    severity: "warning",
    isRead: false,
    createdAt: minutesAgo(40),
  },
  {
    id: 3,
    title: "Upcoming event impact",
    message: "Hayarkon Open-Air Concert expected to bring severe congestion in 6 hours",
    type: "event",
    severity: "warning",
    isRead: false,
    createdAt: minutesAgo(55),
  },
  {
    id: 4,
    title: "Parking near capacity",
    message: "Sarona Market garage is 97% full",
    type: "parking",
    severity: "info",
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    id: 5,
    title: "System health check passed",
    message: "All sensor feeds reporting normally",
    type: "system",
    severity: "success",
    isRead: true,
    createdAt: hoursAgo(2),
  },
  {
    id: 6,
    title: "Incident resolved",
    message: "Vehicle breakdown on Rothschild Blvd cleared, traffic restored",
    type: "incident",
    severity: "success",
    isRead: true,
    createdAt: hoursAgo(3),
  },
];

const congestionData: CongestionPoint[] = [
  { lat: 32.0744, lng: 34.7918, intensity: 0.92, street: "Ayalon Highway S", speed: 12, freeFlowSpeed: 90 },
  { lat: 32.1108, lng: 34.8044, intensity: 0.78, street: "Namir Rd", speed: 22, freeFlowSpeed: 70 },
  { lat: 32.075, lng: 34.7896, intensity: 0.65, street: "Derech Menachem Begin", speed: 28, freeFlowSpeed: 60 },
  { lat: 32.0833, lng: 34.7796, intensity: 0.55, street: "Ibn Gvirol St", speed: 24, freeFlowSpeed: 50 },
  { lat: 32.0808, lng: 34.7738, intensity: 0.42, street: "Dizengoff St", speed: 28, freeFlowSpeed: 50 },
  { lat: 32.0654, lng: 34.7727, intensity: 0.3, street: "Rothschild Blvd", speed: 32, freeFlowSpeed: 50 },
  { lat: 32.0838, lng: 34.8072, intensity: 0.7, street: "Jabotinsky St", speed: 20, freeFlowSpeed: 60 },
  { lat: 32.064, lng: 34.7762, intensity: 0.48, street: "Yehuda Halevi St", speed: 25, freeFlowSpeed: 50 },
  { lat: 32.1024, lng: 34.8076, intensity: 0.6, street: "Rokach Blvd", speed: 26, freeFlowSpeed: 60 },
  { lat: 32.0691, lng: 34.7702, intensity: 0.85, street: "Allenby St", speed: 8, freeFlowSpeed: 40 },
  { lat: 32.0853, lng: 34.7818, intensity: 0.38, street: "Bograshov St", speed: 30, freeFlowSpeed: 50 },
  { lat: 32.0917, lng: 34.7861, intensity: 0.52, street: "Arlozorov St", speed: 25, freeFlowSpeed: 50 },
];

const trafficFlow: TrafficFlowPoint[] = Array.from({ length: 24 }, (_, h) => {
  const peakAm = Math.exp(-Math.pow(h - 8, 2) / 4);
  const peakPm = Math.exp(-Math.pow(h - 18, 2) / 4);
  const base = 0.25 + peakAm * 0.7 + peakPm * 0.85;
  const volume = Math.round(800 + base * 4200);
  const avgSpeed = Math.round(55 - base * 38);
  const congestionIndex = Math.round(base * 100);
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    volume,
    avgSpeed,
    congestionIndex,
  };
});

const feed: FeedEntry[] = [
  { id: 1, entityType: "incident", entityId: 1, action: "created", title: "Critical accident logged", description: "Ayalon Highway S — multi-vehicle collision", severity: "critical", district: "Tel Aviv Center", timestamp: minutesAgo(8) },
  { id: 2, entityType: "roadblock", entityId: 5, action: "opened", title: "Roadblock activated", description: "Ibn Gvirol St closed for emergency repair", severity: "high", district: "Tel Aviv Center", timestamp: minutesAgo(40) },
  { id: 3, entityType: "incident", entityId: 5, action: "updated", title: "Police checkpoint extended", description: "Jabotinsky St inspection ongoing", severity: "medium", district: "Ramat Gan", timestamp: minutesAgo(15) },
  { id: 4, entityType: "notification", entityId: 4, action: "created", title: "Parking alert", description: "Sarona Market 97% full", severity: "info", district: "Tel Aviv Center", timestamp: hoursAgo(1) },
  { id: 5, entityType: "event", entityId: 1, action: "updated", title: "Night Run prep underway", description: "Course staging in Hayarkon Park", severity: "low", district: "North Tel Aviv", timestamp: hoursAgo(2) },
  { id: 6, entityType: "incident", entityId: 7, action: "resolved", title: "Breakdown cleared", description: "Rothschild Blvd lanes reopened", severity: "low", district: "Tel Aviv Center", timestamp: hoursAgo(3) },
  { id: 7, entityType: "roadblock", entityId: 4, action: "closed", title: "Roadblock cleared", description: "Petah Tikva Rd reopened after accident", severity: "medium", district: "Tel Aviv Center", timestamp: hoursAgo(1) },
  { id: 8, entityType: "incident", entityId: 4, action: "created", title: "Roadwork started", description: "Derech Menachem Begin lane closure", severity: "medium", district: "Tel Aviv Center", timestamp: hoursAgo(2) },
];

function summary(): DashboardSummary {
  const active = incidents.filter((i) => i.status !== "resolved");
  const critical = active.filter((i) => i.severity === "critical").length;
  const activeRoadblocks = roadblocks.filter((r) => r.isActive).length;
  const upcomingEvents = events.filter((e) => new Date(e.startTime).getTime() > Date.now()).length;
  const totalParkingSpaces = parkingZones.reduce((s, z) => s + z.totalSpaces, 0);
  const availableParkingSpaces = parkingZones.reduce((s, z) => s + z.availableSpaces, 0);
  const unread = notifications.filter((n) => !n.isRead).length;
  const incidentsByType: Record<string, number> = {};
  const incidentsBySeverity: Record<string, number> = {};
  for (const i of active) {
    incidentsByType[i.type] = (incidentsByType[i.type] || 0) + 1;
    incidentsBySeverity[i.severity] = (incidentsBySeverity[i.severity] || 0) + 1;
  }
  const avgScore = Math.round(
    (congestionData.reduce((s, p) => s + p.intensity, 0) / congestionData.length) * 100,
  );
  let level: DashboardSummary["congestionLevel"] = "low";
  if (avgScore >= 75) level = "severe";
  else if (avgScore >= 55) level = "heavy";
  else if (avgScore >= 35) level = "moderate";
  return {
    activeIncidents: active.length,
    criticalIncidents: critical,
    activeRoadblocks,
    upcomingEvents,
    totalParkingSpaces,
    availableParkingSpaces,
    unreadNotifications: unread,
    congestionLevel: level,
    avgCongestionScore: avgScore,
    incidentsByType,
    incidentsBySeverity,
  };
}

const delay = (ms = 120) => new Promise<void>((res) => setTimeout(res, ms));

export const getListIncidentsQueryKey = (params?: { severity?: string; status?: string; limit?: number }) =>
  ["incidents", params ?? {}] as const;
export const getListRoadblocksQueryKey = (params?: { active?: boolean }) =>
  ["roadblocks", params ?? {}] as const;
export const getListEventsQueryKey = (params?: { upcoming?: boolean }) =>
  ["events", params ?? {}] as const;
export const getListParkingZonesQueryKey = (params?: { available?: boolean; district?: string }) =>
  ["parking-zones", params ?? {}] as const;
export const getListNotificationsQueryKey = (params?: { unread?: boolean }) =>
  ["notifications", params ?? {}] as const;
export const getGetDashboardSummaryQueryKey = () => ["dashboard-summary"] as const;
export const getGetLiveIncidentFeedQueryKey = (params?: { limit?: number }) =>
  ["live-incident-feed", params ?? {}] as const;
export const getGetTrafficFlowQueryKey = () => ["traffic-flow"] as const;
export const getGetCongestionDataQueryKey = () => ["congestion-data"] as const;

type QOpts<T> = { query?: Partial<UseQueryOptions<T>> };
type MOpts<TVars, TData> = { mutation?: Partial<UseMutationOptions<TData, Error, TVars>> };

export function useListIncidents(
  params?: { severity?: IncidentSeverity; status?: IncidentStatus; limit?: number },
  options?: QOpts<Incident[]>,
) {
  return useQuery<Incident[]>({
    queryKey: getListIncidentsQueryKey(params),
    queryFn: async () => {
      await delay();
      let list = [...incidents];
      if (params?.severity) list = list.filter((i) => i.severity === params.severity);
      if (params?.status) list = list.filter((i) => i.status === params.status);
      if (params?.limit) list = list.slice(0, params.limit);
      return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    },
    ...(options?.query ?? {}),
  });
}

export function useUpdateIncident(
  options?: MOpts<{ id: number; data: { status?: IncidentStatus; severity?: IncidentSeverity } }, Incident>,
) {
  return useMutation<Incident, Error, { id: number; data: { status?: IncidentStatus; severity?: IncidentSeverity } }>({
    mutationFn: async ({ id, data }) => {
      await delay();
      const idx = incidents.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Incident not found");
      incidents[idx] = { ...incidents[idx], ...data };
      return incidents[idx];
    },
    ...(options?.mutation ?? {}),
  });
}

export function useListRoadblocks(params?: { active?: boolean }, options?: QOpts<Roadblock[]>) {
  return useQuery<Roadblock[]>({
    queryKey: getListRoadblocksQueryKey(params),
    queryFn: async () => {
      await delay();
      let list = [...roadblocks];
      if (params?.active !== undefined) list = list.filter((r) => r.isActive === params.active);
      return list;
    },
    ...(options?.query ?? {}),
  });
}

export function useUpdateRoadblock(
  options?: MOpts<{ id: number; data: { isActive?: boolean } }, Roadblock>,
) {
  return useMutation<Roadblock, Error, { id: number; data: { isActive?: boolean } }>({
    mutationFn: async ({ id, data }) => {
      await delay();
      const idx = roadblocks.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Roadblock not found");
      roadblocks[idx] = { ...roadblocks[idx], ...data };
      return roadblocks[idx];
    },
    ...(options?.mutation ?? {}),
  });
}

export function useListEvents(params?: { upcoming?: boolean }, options?: QOpts<CityEvent[]>) {
  return useQuery<CityEvent[]>({
    queryKey: getListEventsQueryKey(params),
    queryFn: async () => {
      await delay();
      let list = [...events];
      if (params?.upcoming) list = list.filter((e) => new Date(e.startTime).getTime() > Date.now());
      return list.sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
    },
    ...(options?.query ?? {}),
  });
}

export function useListParkingZones(
  params?: { available?: boolean; district?: string },
  options?: QOpts<ParkingZone[]>,
) {
  return useQuery<ParkingZone[]>({
    queryKey: getListParkingZonesQueryKey(params),
    queryFn: async () => {
      await delay();
      let list = [...parkingZones];
      if (params?.available) list = list.filter((z) => z.availableSpaces > 0 && z.isOpen);
      if (params?.district) list = list.filter((z) => z.district === params.district);
      return list;
    },
    ...(options?.query ?? {}),
  });
}

export function useListNotifications(params?: { unread?: boolean }, options?: QOpts<Notification[]>) {
  return useQuery<Notification[]>({
    queryKey: getListNotificationsQueryKey(params),
    queryFn: async () => {
      await delay();
      let list = [...notifications];
      if (params?.unread) list = list.filter((n) => !n.isRead);
      return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    },
    ...(options?.query ?? {}),
  });
}

export function useMarkNotificationRead(options?: MOpts<{ id: number }, Notification>) {
  return useMutation<Notification, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      await delay();
      const idx = notifications.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error("Notification not found");
      notifications[idx] = { ...notifications[idx], isRead: true };
      return notifications[idx];
    },
    ...(options?.mutation ?? {}),
  });
}

export function useGetDashboardSummary(options?: QOpts<DashboardSummary>) {
  return useQuery<DashboardSummary>({
    queryKey: getGetDashboardSummaryQueryKey(),
    queryFn: async () => {
      await delay();
      return summary();
    },
    refetchInterval: 30_000,
    ...(options?.query ?? {}),
  });
}

export function useGetLiveIncidentFeed(params?: { limit?: number }, options?: QOpts<FeedEntry[]>) {
  return useQuery<FeedEntry[]>({
    queryKey: getGetLiveIncidentFeedQueryKey(params),
    queryFn: async () => {
      await delay();
      const sorted = [...feed].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
      return params?.limit ? sorted.slice(0, params.limit) : sorted;
    },
    refetchInterval: 15_000,
    ...(options?.query ?? {}),
  });
}

export function useGetTrafficFlow(options?: QOpts<TrafficFlowPoint[]>) {
  return useQuery<TrafficFlowPoint[]>({
    queryKey: getGetTrafficFlowQueryKey(),
    queryFn: async () => {
      await delay();
      return trafficFlow;
    },
    ...(options?.query ?? {}),
  });
}

export function useGetCongestionData(options?: QOpts<CongestionPoint[]>) {
  return useQuery<CongestionPoint[]>({
    queryKey: getGetCongestionDataQueryKey(),
    queryFn: async () => {
      await delay();
      return congestionData;
    },
    refetchInterval: 30_000,
    ...(options?.query ?? {}),
  });
}
