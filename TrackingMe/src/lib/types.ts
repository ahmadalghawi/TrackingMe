export type OrderStatus =
  | 'delivered'
  | 'on-the-way'
  | 'out-for-delivery'
  | 'ready-for-pickup'
  | 'order-info-received';

export interface RawOrder {
  id: number;
  status: OrderStatus | string;
  eta: string;
  parcel_id: string;
  sender: string;
  verification_required: boolean;
  location_id: string;
  location_name: string;
  location_coordinate_latitude: number;
  location_coordinate_longitude: number;
  location_status_ok: boolean;
  user_phone: string;
  user_name: string;
  notes: string | null;
  last_updated: string;
}

/** Collapsed card-level status (maps many API statuses → 4 pill colors). */
export type CardStatusKey = 'delivered' | 'out-for-delivery' | 'in-transit' | 'processing';

/** Translation-key-based view model. All user-visible strings are i18n keys. */
export interface TrackingCardVM {
  id: string;
  title: string;
  courier: string;
  courierColor: string;
  status: CardStatusKey;
  /** i18n key, e.g. 'status.delivered' */
  statusLabelKey: string;
  progress: number;
  /** i18n keys, 4 stops */
  stopKeys: readonly string[];
  activeStop: number;
  location: string;
  /** raw ISO so consumers can format per-locale */
  _etaRaw: string;
  _updatedRaw: string;
  _raw: RawOrder;
}

export interface TrackingResult {
  source: 'api' | 'fallback';
  items: TrackingCardVM[];
}

/* ---------- Tweaks ---------- */
export type LayoutMode = 'fan' | 'stack' | 'grid';
export type WordmarkMode = 'split' | 'bold' | 'outline';

export interface Tweaks {
  layout: LayoutMode;
  accentHue: number;
  floatAmp: number;
  wordmark: WordmarkMode;
}

/* ---------- Settings (i18n + theme) ---------- */
export type ThemeMode = 'light' | 'dark';
export type LangCode = 'en' | 'sv';

export interface Settings {
  theme: ThemeMode;
  lang: LangCode;
}

/* ---------- Timeline event ---------- */
export interface TimelineEvent {
  key: string;
  labelKey: string;
  icon: string;
  city: string | null;
  cityKey: string | null;
  time: Date;
  complete: boolean;
}
