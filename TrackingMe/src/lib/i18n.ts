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
    'nav.pricing': 'Pricing',
    'nav.solutions': 'Solutions',
    'nav.contact': 'Contact Us',
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
    // Couriers page
    'couriers.badge': '1,200+ carriers',
    'couriers.title.prefix': 'Every courier,',
    'couriers.title.accent': 'one dashboard.',
    'couriers.subtitle': 'We integrate with over 1,200 carriers worldwide so you never have to switch tabs.',
    'couriers.stat.carriers': 'Carriers integrated',
    'couriers.stat.countries': 'Countries covered',
    'couriers.stat.uptime': 'API uptime',
    'couriers.col.carrier': 'Carrier',
    'couriers.col.tracking': 'Live Tracking',
    'couriers.col.api': 'API Access',
    'couriers.col.eta': 'ETA',
    'couriers.footer.missing': 'Missing your carrier?',
    'couriers.footer.requestIt': 'Request an integration →',
    // Solutions page
    'solutions.badge': 'Built for every team',
    'solutions.title.prefix': 'The tracking platform that',
    'solutions.title.accent': 'fits your workflow.',
    'solutions.subtitle': 'From solo sellers to enterprise logistics, TrackMe adapts to how you ship.',
    'solutions.cta.pricing': 'View pricing →',
    'solutions.cta.contact': 'Talk to us',
    'solutions.learnMore': 'Learn more',
    'solutions.card.ecom.title': 'E-commerce & Retail',
    'solutions.card.ecom.desc': 'Automatic order import from your store. Keep customers informed with branded tracking pages.',
    'solutions.card.enterprise.title': 'Enterprise Logistics',
    'solutions.card.enterprise.desc': 'Dedicated SLA, private cloud options, and a full-featured REST API for your ops team.',
    'solutions.card.startup.title': 'Startups & Developers',
    'solutions.card.startup.desc': 'A generous free tier plus a sandbox environment to prototype without limits.',
    'solutions.card.logistics.title': '3PL & Fulfillment',
    'solutions.card.logistics.desc': 'Bulk CSV import, multi-carrier analytics, and white-label tracking for your clients.',
    'solutions.how.title': 'How it works',
    'solutions.how.step1.title': 'Connect your store',
    'solutions.how.step1.desc': 'Paste your API key or install our plugin for Shopify, WooCommerce, or any custom platform.',
    'solutions.how.step2.title': 'We sync your orders',
    'solutions.how.step2.desc': 'TrackMe automatically fetches tracking numbers and matches them to the right carrier.',
    'solutions.how.step3.title': 'Your customers stay informed',
    'solutions.how.step3.desc': 'Automated notifications and a live tracking page — no manual work, ever.',
    // Contact page
    'contact.badge': 'Get in touch',
    'contact.title.prefix': 'We\'re here',
    'contact.title.accent': 'to help.',
    'contact.subtitle': 'Have a question, want a demo, or need a custom plan? Drop us a message.',
    'contact.form.title': 'Send us a message',
    'contact.form.name': 'Full name',
    'contact.form.namePlaceholder': 'Alex Rivers',
    'contact.form.email': 'Email address',
    'contact.form.emailPlaceholder': 'you@example.com',
    'contact.form.subject': 'Subject',
    'contact.form.subjectPlaceholder': 'e.g. Custom enterprise plan',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us what you need…',
    'contact.form.send': 'Send message →',
    'contact.form.successTitle': 'Message sent!',
    'contact.form.successDesc': 'We\'ll get back to you within one business day.',
    'contact.form.sendAnother': 'Send another',
    'contact.info.email': 'Email',
    'contact.info.chat': 'Live chat',
    'contact.info.chatValue': 'Available Mon–Fri, 9–17 CET',
    'contact.info.response': 'Response time',
    'contact.info.responseValue': 'Within 1 business day',
    'contact.faq.title': 'Frequently asked',
    'contact.faq.q1': 'Is there a free plan?',
    'contact.faq.a1': 'Yes! Our Starter tier is free up to 50 parcels per month, no credit card needed.',
    'contact.faq.q2': 'Which couriers are supported?',
    'contact.faq.a2': 'We support 1,200+ carriers across 190 countries. Check the Couriers page for the full list.',
    'contact.faq.q3': 'Can I use my own branding?',
    'contact.faq.a3': 'Custom branded tracking pages are available on Pro and Enterprise plans.',
    'contact.faq.q4': 'How do I get API access?',
    'contact.faq.a4': 'All paid plans include API access. Sign up, go to Settings → API, and generate your key.',
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
    'nav.pricing': 'Priser',
    'nav.solutions': 'Lösningar',
    'nav.contact': 'Kontakta Oss',
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
    // Couriers page (SV)
    'couriers.badge': '1 200+ transportörer',
    'couriers.title.prefix': 'Varje transportör,',
    'couriers.title.accent': 'ett dashboard.',
    'couriers.subtitle': 'Vi integrerar med över 1 200 transportörer världen över så att du aldrig behöver byta flik.',
    'couriers.stat.carriers': 'Integrerade transportörer',
    'couriers.stat.countries': 'Länder täckta',
    'couriers.stat.uptime': 'API-drifttid',
    'couriers.col.carrier': 'Transportör',
    'couriers.col.tracking': 'Direktspårning',
    'couriers.col.api': 'API-åtkomst',
    'couriers.col.eta': 'ETA',
    'couriers.footer.missing': 'Saknas din transportör?',
    'couriers.footer.requestIt': 'Begär en integration →',
    // Solutions page (SV)
    'solutions.badge': 'Byggt för alla team',
    'solutions.title.prefix': 'Spårningsplattformen som',
    'solutions.title.accent': 'passar ditt flöde.',
    'solutions.subtitle': 'Från ensamförsäljare till stor logistik — TrackMe anpassar sig efter hur du skickar.',
    'solutions.cta.pricing': 'Se priser →',
    'solutions.cta.contact': 'Prata med oss',
    'solutions.learnMore': 'Läs mer',
    'solutions.card.ecom.title': 'E-handel & Detaljhandel',
    'solutions.card.ecom.desc': 'Automatisk orderimport från din butik. Håll kunder informerade med märkta spårningssidor.',
    'solutions.card.enterprise.title': 'Företagslogistik',
    'solutions.card.enterprise.desc': 'Dedikerad SLA, privata molnalternativ och ett fullfjädrat REST API för ditt ops-team.',
    'solutions.card.startup.title': 'Startups & Utvecklare',
    'solutions.card.startup.desc': 'En generös gratiskvot och en sandlådemiljö för att prototypa utan begränsningar.',
    'solutions.card.logistics.title': '3PL & Fulfillment',
    'solutions.card.logistics.desc': 'Massimport via CSV, multi-transportör-analys och whitelabel-spårning för dina kunder.',
    'solutions.how.title': 'Så här fungerar det',
    'solutions.how.step1.title': 'Anslut din butik',
    'solutions.how.step1.desc': 'Klistra in din API-nyckel eller installera vårt plugin för Shopify, WooCommerce eller annan plattform.',
    'solutions.how.step2.title': 'Vi synkroniserar dina ordrar',
    'solutions.how.step2.desc': 'TrackMe hämtar automatiskt spårningsnummer och matchar dem till rätt transportör.',
    'solutions.how.step3.title': 'Dina kunder hålls informerade',
    'solutions.how.step3.desc': 'Automatiska notiser och en direktsänd spårningssida — aldrig manuellt arbete.',
    // Contact page (SV)
    'contact.badge': 'Ta kontakt',
    'contact.title.prefix': 'Vi är här',
    'contact.title.accent': 'för att hjälpa.',
    'contact.subtitle': 'Har du en fråga, vill ha en demo eller behöver en anpassad plan? Skicka ett meddelande.',
    'contact.form.title': 'Skicka ett meddelande',
    'contact.form.name': 'Fullständigt namn',
    'contact.form.namePlaceholder': 'Alex Rivers',
    'contact.form.email': 'E-postadress',
    'contact.form.emailPlaceholder': 'du@exempel.com',
    'contact.form.subject': 'Ämne',
    'contact.form.subjectPlaceholder': 't.ex. Anpassad företagsplan',
    'contact.form.message': 'Meddelande',
    'contact.form.messagePlaceholder': 'Berätta vad du behöver…',
    'contact.form.send': 'Skicka meddelande →',
    'contact.form.successTitle': 'Meddelande skickat!',
    'contact.form.successDesc': 'Vi återkommer inom en arbetsdag.',
    'contact.form.sendAnother': 'Skicka ett till',
    'contact.info.email': 'E-post',
    'contact.info.chat': 'Livechatt',
    'contact.info.chatValue': 'Tillgänglig mån–fre, 9–17 CET',
    'contact.info.response': 'Svarstid',
    'contact.info.responseValue': 'Inom en arbetsdag',
    'contact.faq.title': 'Vanliga frågor',
    'contact.faq.q1': 'Finns det en gratis plan?',
    'contact.faq.a1': 'Ja! Vår Starter-nivå är gratis upp till 50 paket per månad, inget kreditkort krävs.',
    'contact.faq.q2': 'Vilka transportörer stöds?',
    'contact.faq.a2': 'Vi stödjer 1 200+ transportörer i 190 länder. Se Transportörer-sidan för hela listan.',
    'contact.faq.q3': 'Kan jag använda min egen varumärkning?',
    'contact.faq.a3': 'Anpassade spårningssidor finns på Pro- och Företagsplaner.',
    'contact.faq.q4': 'Hur får jag API-åtkomst?',
    'contact.faq.a4': 'Alla betalda planer inkluderar API-åtkomst. Registrera dig, gå till Inställningar → API och generera din nyckel.',
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
