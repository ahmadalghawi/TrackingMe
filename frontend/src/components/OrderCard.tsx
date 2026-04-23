import { useState } from 'react';
import type { Order } from '../types/order';
import { useTranslation } from 'react-i18next';
import { Truck, Package, CheckCircle, Info, MapPin, Clock, Phone, FileText, ChevronDown } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

const STATUS_MAP = {
  'on-the-way': {
    label: 'In Transit', progress: 60,
    icon: <Truck size={13} />,
    pill: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    dot: 'bg-blue-500',
    bar: 'from-blue-400 to-blue-600',
  },
  'ready-for-pickup': {
    label: 'Ready for Pickup', progress: 85,
    icon: <Package size={13} />,
    pill: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    bar: 'from-amber-400 to-amber-600',
  },
  delivered: {
    label: 'Delivered', progress: 100,
    icon: <CheckCircle size={13} />,
    pill: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    bar: 'from-emerald-400 to-emerald-600',
  },
  'order-info-received': {
    label: 'Processing', progress: 20,
    icon: <Info size={13} />,
    pill: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
    bar: 'from-muted-foreground to-muted-foreground',
  },
};

const getStatus = (s: Order['status']) =>
  STATUS_MAP[s as keyof typeof STATUS_MAP] ?? STATUS_MAP['order-info-received'];

export default function OrderCard({ order }: OrderCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(order.status);

  return (
    <article
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        expanded
          ? 'border-primary/40 shadow-lg shadow-primary/10 bg-card'
          : 'border-border/60 bg-card/70 hover:bg-card hover:border-border hover:shadow-md hover:shadow-black/5'
      }`}
    >
      {/* ── Accent bar on left edge ── */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${status.bar} opacity-60`}
      />

      {/* ── Header (always visible) ── */}
      <button
        id={`order-card-${order.id}`}
        className="w-full text-left px-5 py-4 pl-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Top row: status pill + verification */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide ${status.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              {order.verification_required && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-medium">
                  🔒 {t('card.verification')}
                </span>
              )}
            </div>

            {/* Data grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <MetaItem label={t('card.parcelId')} icon={<Package size={11} />}>
                <span className="font-mono font-bold">#{order.parcel_id}</span>
              </MetaItem>
              <MetaItem label={t('card.sender')} icon={<FileText size={11} />}>
                {order.sender}
              </MetaItem>
              <MetaItem label={t('card.eta')} icon={<Clock size={11} />}>
                {formatDate(order.eta)}
              </MetaItem>
              <MetaItem label={t('card.location')} icon={<MapPin size={11} />}>
                {order.location_name}
              </MetaItem>
            </div>
          </div>

          {/* Expand chevron */}
          <div className={`mt-1 shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
            expanded
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'bg-muted text-muted-foreground border border-border group-hover:text-foreground'
          }`}>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-3 mb-1">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${status.bar} transition-all duration-700`}
              style={{ width: `${status.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {['Ordered', 'Transit', 'Arrived'].map((stop, i) => {
              const thresholds = [20, 60, 100];
              return (
                <span
                  key={stop}
                  className={`font-mono text-[9px] uppercase tracking-wider ${
                    status.progress >= thresholds[i] ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {stop}
                </span>
              );
            })}
          </div>
        </div>
      </button>

      {/* ── Expanded details ── */}
      <div
        className={`overflow-hidden transition-all duration-400 ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-1 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">

            <div className="space-y-3">
              <SectionTitle>Customer</SectionTitle>
              <ExpandRow label={t('card.customer')} value={order.user_name} />
              <ExpandRow
                label={t('card.phone')}
                value={order.user_phone}
                icon={<Phone size={11} />}
              />
            </div>

            <div className="space-y-3">
              <SectionTitle>Location</SectionTitle>
              <ExpandRow
                label={t('card.locationOk')}
                value={order.location_status_ok ? '✅ ' + t('card.locationOk') : '⚠️ ' + t('card.locationIssue')}
              />
              <ExpandRow
                label={t('card.coordinates')}
                value={`${order.location_coordinate_latitude.toFixed(4)}, ${order.location_coordinate_longitude.toFixed(4)}`}
              />
            </div>

            <div className="sm:col-span-2">
              <ExpandRow
                label={t('card.locationId')}
                value={order.location_id}
                mono
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <SectionTitle>{t('card.notes')}</SectionTitle>
              <p className={`text-sm rounded-xl px-3 py-2 leading-relaxed ${
                order.notes
                  ? 'bg-amber-50/50 dark:bg-amber-900/10 text-card-foreground border border-amber-200/50 dark:border-amber-800/30'
                  : 'text-muted-foreground italic'
              }`}>
                {order.notes ?? t('card.noNotes')}
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-border/50 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t('card.lastUpdated')}: <span className="text-foreground font-medium">{formatDate(order.last_updated)}</span>
              </p>
              {status.icon && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {status.icon} {status.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetaItem({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mb-0.5 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm text-foreground font-semibold truncate">{children}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] text-primary font-bold uppercase tracking-widest pb-1 border-b border-primary/20">
      {children}
    </h4>
  );
}

function ExpandRow({ label, value, icon, mono }: {
  label: string; value: string; icon?: React.ReactNode; mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">{icon} {label}</p>
      <p className={`text-sm text-card-foreground ${mono ? 'font-mono text-xs break-all' : 'font-medium'}`}>{value}</p>
    </div>
  );
}
