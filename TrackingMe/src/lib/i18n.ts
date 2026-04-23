import { useCallback, useEffect, useState } from 'react';
import type { Settings } from './types';

const SETTINGS_KEY = 'trackme.settings';
const DEFAULTS: Settings = { theme: 'light', lang: 'en' };

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}
function writeSettings(s: Settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Sync <html> immediately (before React mounts)
if (typeof document !== 'undefined') {
  const s = readSettings();
  applyTheme(s.theme);
  document.documentElement.setAttribute('lang', s.lang);
}

/* ---------- Translation dictionary ---------- */
type Dict = Record<string, string>;
const TRANSLATIONS: Record<string, Dict> = {
  en: {
    // Nav
    'nav.tracking': 'Tracking',
    'nav.couriers': 'Couriers',
    'nav.api': 'API',
    'nav.pricing': 'Pricing',
    'nav.startTracking': 'Start tracking →',
    'nav.back': '← Back to home',
    'nav.theme.light': 'Light mode',
    'nav.theme.dark': 'Dark mode',
    'nav.lang.en': 'English',
    'nav.lang.sv': 'Svenska',
    // Hero
    'hero.badge': '{count} packages in flight · live',
    'hero.wordmark.track': 'Track',
    'hero.wordmark.me': 'me',
    'hero.subtitle': "Every parcel, every courier, one quiet dashboard. Tap the box — it's unpacking something for you.",
    'hero.hint.click': 'click',
    'hero.hint.or': 'or',
    'hero.hint.open': 'to open',
    'hero.openTheBox': 'open the box!',
    // Stats
    'stats.parcels': 'parcels tracked',
    'stats.couriers': 'couriers supported',
    'stats.uptime': 'uptime last 90d',
    'stats.latency': 'median API latency',
    // Cards
    'card.packItBack': 'Pack it back up',
    'card.source.api': 'Live · Mockaroo API',
    'card.source.fallback': 'Offline · bundled sample',
    'card.eta': 'ETA',
    'card.location': 'Location',
    // Expanded
    'exp.recent': 'Recent activity',
    'exp.scanEvents': '{n} scan events',
    'exp.viewFull': 'View full tracking',
    // Stops
    'stop.placed': 'Placed',
    'stop.hub': 'Hub',
    'stop.transit': 'Transit',
    'stop.delivery': 'Delivery',
    // Statuses
    'status.delivered': 'Delivered',
    'status.onTheWay': 'On the way',
    'status.outForDelivery': 'Out for delivery',
    'status.readyForPickup': 'Ready for pickup',
    'status.infoReceived': 'Info received',
    // Filters
    'filter.all': 'All',
    'filter.processing': 'Processing',
    'filter.inTransit': 'In transit',
    'filter.outForDelivery': 'Out for delivery',
    'filter.delivered': 'Delivered',
    // Sort
    'sort.label': 'Sort',
    'sort.etaAsc': 'Arriving soonest',
    'sort.etaDesc': 'Arriving latest',
    'sort.newest': 'Newest first',
    'sort.oldest': 'Oldest first',
    'sort.status': 'By status',
    // Tracking page
    'tp.parcelCount': '{n} {noun} in your account',
    'tp.parcel': 'parcel',
    'tp.parcels': 'parcels',
    'tp.loading': 'Loading orders…',
    'tp.title.your': 'Your',
    'tp.title.parcels': 'parcels',
    'tp.subtitle': 'Every order from every courier, in one quiet list. Tap any card to see the full scan-event timeline.',
    'tp.timeline': 'Courier timeline',
    'tp.timelineSub': '{n} scan events · updates every ~4 hours',
    // Empty
    'empty.noOrders': 'No orders yet',
    'empty.noMatch': 'Nothing matches "{filter}"',
    'empty.subNoOrders': "When you place an order, it'll show up here with live tracking.",
    'empty.subNoMatch': 'Try a different filter or clear it to see everything.',
    'empty.clearFilter': 'Clear filter',
    // Footer
    'footer.version': 'TrackMe · v0.4',
    'footer.refresh': 'Data refreshes automatically · next sync in ~4 min',
    // Timeline events
    'evt.placed': 'Order placed',
    'evt.label': 'Shipping label created',
    'evt.pickup': 'Picked up by courier',
    'evt.origin': 'Departed origin facility',
    'evt.hub': 'Arrived at sorting hub',
    'evt.departed': 'Departed sorting hub',
    'evt.inTransit': 'In transit',
    'evt.localHub': 'Arrived at local facility',
    'evt.outForDel': 'Out for delivery',
    'evt.delivered': 'Delivered',
    'evt.origin.facility': 'Origin facility',
    'evt.nextStop': 'Next stop',
    // Tweaks
    'tw.title': 'Tweaks',
    'tw.layout': 'Layout',
    'tw.layout.fan': 'Fan',
    'tw.layout.stack': 'Stack',
    'tw.layout.grid': 'Grid',
    'tw.hue': 'Accent hue',
    'tw.wordmark': 'Wordmark',
    'tw.wordmark.split': 'Split',
    'tw.wordmark.bold': 'Bold',
    'tw.wordmark.outline': 'Outline',
    'tw.float': 'Float amp',
  },
  sv: {
    'nav.tracking': 'Spårning',
    'nav.couriers': 'Transportörer',
    'nav.api': 'API',
    'nav.pricing': 'Priser',
    'nav.startTracking': 'Börja spåra →',
    'nav.back': '← Tillbaka',
    'nav.theme.light': 'Ljust läge',
    'nav.theme.dark': 'Mörkt läge',
    'nav.lang.en': 'English',
    'nav.lang.sv': 'Svenska',
    'hero.badge': '{count} paket på väg · direktsänt',
    'hero.wordmark.track': 'Spåra',
    'hero.wordmark.me': 'mig',
    'hero.subtitle': 'Varje paket, varje transportör, en lugn översikt. Tryck på lådan — den packar upp något åt dig.',
    'hero.hint.click': 'klicka',
    'hero.hint.or': 'eller',
    'hero.hint.open': 'för att öppna',
    'hero.openTheBox': 'öppna lådan!',
    'stats.parcels': 'paket spårade',
    'stats.couriers': 'transportörer stöds',
    'stats.uptime': 'drifttid senaste 90 d',
    'stats.latency': 'median API-latens',
    'card.packItBack': 'Packa ihop igen',
    'card.source.api': 'Direkt · Mockaroo API',
    'card.source.fallback': 'Offline · lokalt urval',
    'card.eta': 'Beräknad',
    'card.location': 'Plats',
    'exp.recent': 'Senaste aktivitet',
    'exp.scanEvents': '{n} skanningar',
    'exp.viewFull': 'Visa full spårning',
    'stop.placed': 'Lagd',
    'stop.hub': 'Terminal',
    'stop.transit': 'På väg',
    'stop.delivery': 'Leverans',
    'status.delivered': 'Levererat',
    'status.onTheWay': 'På väg',
    'status.outForDelivery': 'Ute för leverans',
    'status.readyForPickup': 'Redo för upphämtning',
    'status.infoReceived': 'Info mottagen',
    'filter.all': 'Alla',
    'filter.processing': 'Förbereds',
    'filter.inTransit': 'På väg',
    'filter.outForDelivery': 'Ute för leverans',
    'filter.delivered': 'Levererat',
    'sort.label': 'Sortera',
    'sort.etaAsc': 'Snarast först',
    'sort.etaDesc': 'Senast först',
    'sort.newest': 'Nyaste först',
    'sort.oldest': 'Äldsta först',
    'sort.status': 'Efter status',
    'tp.parcelCount': '{n} {noun} i ditt konto',
    'tp.parcel': 'paket',
    'tp.parcels': 'paket',
    'tp.loading': 'Laddar beställningar…',
    'tp.title.your': 'Dina',
    'tp.title.parcels': 'paket',
    'tp.subtitle': 'Alla beställningar från alla transportörer i en lugn lista. Tryck på ett kort för att se full skannings-historik.',
    'tp.timeline': 'Transporthistorik',
    'tp.timelineSub': '{n} skanningar · uppdateras var ~4:e timme',
    'empty.noOrders': 'Inga beställningar ännu',
    'empty.noMatch': 'Inget matchar "{filter}"',
    'empty.subNoOrders': 'När du lägger en beställning dyker den upp här med direktsänd spårning.',
    'empty.subNoMatch': 'Prova ett annat filter eller rensa det för att se allt.',
    'empty.clearFilter': 'Rensa filter',
    'footer.version': 'TrackMe · v0.4',
    'footer.refresh': 'Uppdateras automatiskt · nästa synk om ~4 min',
    'evt.placed': 'Beställning lagd',
    'evt.label': 'Fraktsedel skapad',
    'evt.pickup': 'Upphämtad av transportör',
    'evt.origin': 'Lämnade avsändarens terminal',
    'evt.hub': 'Ankom sorteringsterminal',
    'evt.departed': 'Lämnade sorteringsterminal',
    'evt.inTransit': 'På väg',
    'evt.localHub': 'Ankom lokal terminal',
    'evt.outForDel': 'Ute för leverans',
    'evt.delivered': 'Levererat',
    'evt.origin.facility': 'Avsändarens terminal',
    'evt.nextStop': 'Nästa stopp',
    'tw.title': 'Justeringar',
    'tw.layout': 'Layout',
    'tw.layout.fan': 'Solfjäder',
    'tw.layout.stack': 'Stapel',
    'tw.layout.grid': 'Rutnät',
    'tw.hue': 'Accentfärg',
    'tw.wordmark': 'Ordmärke',
    'tw.wordmark.split': 'Delad',
    'tw.wordmark.bold': 'Fet',
    'tw.wordmark.outline': 'Kontur',
    'tw.float': 'Sväva-styrka',
  },
};

export function translate(lang: string, key: string, vars?: Record<string, string | number>): string {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  let s = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
    });
  }
  return s;
}

const SETTINGS_EVENT = 'trackme:settings';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(readSettings);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) setSettingsState(readSettings());
    };
    const onCustom = () => setSettingsState(readSettings());
    window.addEventListener('storage', onStorage);
    window.addEventListener(SETTINGS_EVENT, onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SETTINGS_EVENT, onCustom);
    };
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    const next: Settings = { ...readSettings(), ...patch };
    writeSettings(next);
    applyTheme(next.theme);
    document.documentElement.setAttribute('lang', next.lang);
    setSettingsState(next);
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(settings.lang, key, vars),
    [settings.lang],
  );

  return { settings, setSettings, t };
}
