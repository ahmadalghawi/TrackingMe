import type { RawOrder, TimelineEvent, TrackingCardVM, TrackingResult } from './types';

const API_URL = 'https://my.api.mockaroo.com/orders.json?key=e49e6840';
const FALLBACK_URL = '/packagedata.json';

const STATUS_MAP: Record<string, { key: TrackingCardVM['status']; labelKey: string; progress: number; activeStop: number }> = {
  'delivered':           { key: 'delivered',        labelKey: 'status.delivered',      progress: 1.00, activeStop: 4 },
  'on-the-way':          { key: 'in-transit',       labelKey: 'status.onTheWay',       progress: 0.55, activeStop: 2 },
  'out-for-delivery':    { key: 'out-for-delivery', labelKey: 'status.outForDelivery', progress: 0.85, activeStop: 3 },
  'ready-for-pickup':    { key: 'in-transit',       labelKey: 'status.readyForPickup', progress: 0.90, activeStop: 3 },
  'order-info-received': { key: 'processing',       labelKey: 'status.infoReceived',   progress: 0.15, activeStop: 1 },
};

const COURIER_COLORS = [
  'oklch(0.55 0.14 45)',
  'oklch(0.55 0.18 305)',
  'oklch(0.55 0.16 25)',
  'oklch(0.72 0.17 85)',
  'oklch(0.55 0.16 155)',
  'oklch(0.55 0.16 235)',
];

const STOP_KEYS = ['stop.placed', 'stop.hub', 'stop.transit', 'stop.delivery'] as const;

export function normalize(rec: RawOrder, i: number): TrackingCardVM {
  const s = STATUS_MAP[rec.status] ?? { key: 'processing' as const, labelKey: 'status.infoReceived', progress: 0.3, activeStop: 1 };
  return {
    id: `TM-${String(rec.parcel_id ?? rec.id).padStart(4, '0')}`,
    title: rec.sender || 'Unknown sender',
    courier: rec.location_name || '—',
    courierColor: COURIER_COLORS[i % COURIER_COLORS.length],
    status: s.key,
    statusLabelKey: s.labelKey,
    progress: s.progress,
    stopKeys: STOP_KEYS,
    activeStop: s.activeStop,
    location: rec.location_name || '—',
    _etaRaw: rec.eta || '',
    _updatedRaw: rec.last_updated || '',
    _raw: rec,
  };
}

export async function fetchTrackingAll(): Promise<TrackingResult> {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 3500);
    const r = await fetch(API_URL, { signal: ctrl.signal });
    clearTimeout(to);
    if (!r.ok) throw new Error(`status ${r.status}`);
    const data = (await r.json()) as RawOrder[];
    if (Array.isArray(data) && data.length) {
      return { source: 'api', items: data.map(normalize) };
    }
    throw new Error('empty');
  } catch {
    const r = await fetch(FALLBACK_URL);
    const data = (await r.json()) as RawOrder[];
    return { source: 'fallback', items: data.map(normalize) };
  }
}

/** Hero page — take first 4. */
export async function fetchTracking(): Promise<TrackingResult> {
  const res = await fetchTrackingAll();
  return { ...res, items: res.items.slice(0, 4) };
}

/* ---------- Date formatting (locale aware) ---------- */
export function formatEta(iso: string, lang: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const loc = lang === 'sv' ? 'sv-SE' : undefined;
    return (
      d.toLocaleDateString(loc, { month: 'short', day: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' })
    );
  } catch {
    return iso;
  }
}

export function formatEventTime(d: Date, lang: string): string {
  try {
    const loc = lang === 'sv' ? 'sv-SE' : undefined;
    return (
      d.toLocaleDateString(loc, { month: 'short', day: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' })
    );
  } catch {
    return '';
  }
}

/* ---------- Deterministic timeline generator ---------- */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seeded(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const CITY_POOL = [
  'Newark, NJ', 'Memphis, TN', 'Louisville, KY', 'Cincinnati, OH',
  'Ontario, CA', 'Dallas, TX', 'Chicago, IL', 'Atlanta, GA',
  'Kansas City, MO', 'Columbus, OH', 'Phoenix, AZ', 'Denver, CO',
  'Portland, OR', 'Seattle, WA', 'Salt Lake City, UT',
];
const EVENT_TEMPLATES: Record<string, { labelKey: string; icon: string }> = {
  placed:    { labelKey: 'evt.placed',    icon: '●' },
  label:     { labelKey: 'evt.label',     icon: '◐' },
  pickup:    { labelKey: 'evt.pickup',    icon: '↗' },
  origin:    { labelKey: 'evt.origin',    icon: '→' },
  hub:       { labelKey: 'evt.hub',       icon: '⎔' },
  departed:  { labelKey: 'evt.departed',  icon: '→' },
  inTransit: { labelKey: 'evt.inTransit', icon: '✈' },
  localHub:  { labelKey: 'evt.localHub',  icon: '⌂' },
  outForDel: { labelKey: 'evt.outForDel', icon: '🚚' },
  delivered: { labelKey: 'evt.delivered', icon: '✓' },
};
const STATUS_DEPTH: Record<string, number> = {
  'processing': 1,
  'in-transit': 6,
  'out-for-delivery': 8,
  'delivered': 9,
};

export function buildTimeline(item: TrackingCardVM): TimelineEvent[] {
  const rand = seeded(hash(item.id + item.courier));
  const pickCity = () => CITY_POOL[Math.floor(rand() * CITY_POOL.length)];
  const etaDate = item._etaRaw ? new Date(item._etaRaw) : new Date();
  if (Number.isNaN(etaDate.getTime())) etaDate.setTime(Date.now());
  const order = ['placed', 'label', 'pickup', 'origin', 'hub', 'departed', 'inTransit', 'localHub', 'outForDel', 'delivered'];
  const depth = STATUS_DEPTH[item.status] ?? 6;
  const events: TimelineEvent[] = [];
  const start = new Date(etaDate.getTime() - order.length * 18 * 60 * 60 * 1000);
  for (let i = 0; i <= Math.min(depth, order.length - 1); i++) {
    const key = order[i];
    const t = new Date(start.getTime() + i * (18 + rand() * 6) * 60 * 60 * 1000);
    const isOriginEvt = key === 'placed' || key === 'label';
    events.push({
      key,
      labelKey: EVENT_TEMPLATES[key].labelKey,
      icon: EVENT_TEMPLATES[key].icon,
      city: key === 'delivered' ? item.location : (isOriginEvt ? null : pickCity()),
      cityKey: isOriginEvt ? 'evt.origin.facility' : null,
      time: t,
      complete: true,
    });
  }
  if (depth < order.length - 1) {
    const nextKey = order[depth + 1];
    events.push({
      key: nextKey,
      labelKey: EVENT_TEMPLATES[nextKey].labelKey,
      icon: EVENT_TEMPLATES[nextKey].icon,
      city: nextKey === 'delivered' ? item.location : null,
      cityKey: nextKey === 'delivered' ? null : 'evt.nextStop',
      time: new Date(etaDate.getTime() - (order.length - depth - 1) * 12 * 60 * 60 * 1000),
      complete: false,
    });
  }
  return events.reverse();
}
