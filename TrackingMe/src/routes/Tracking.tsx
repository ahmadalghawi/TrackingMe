import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/lib/i18n';
import { buildTimeline, fetchTrackingAll, formatEta, formatEventTime } from '@/lib/tracking';
import type { TimelineEvent, TrackingCardVM } from '@/lib/types';

const STATUS_FILTERS = [
  { key: 'all',              labelKey: 'filter.all' },
  { key: 'processing',       labelKey: 'filter.processing' },
  { key: 'in-transit',       labelKey: 'filter.inTransit' },
  { key: 'out-for-delivery', labelKey: 'filter.outForDelivery' },
  { key: 'delivered',        labelKey: 'filter.delivered' },
] as const;

const SORT_OPTIONS = [
  { key: 'eta-asc',  labelKey: 'sort.etaAsc' },
  { key: 'eta-desc', labelKey: 'sort.etaDesc' },
  { key: 'newest',   labelKey: 'sort.newest' },
  { key: 'oldest',   labelKey: 'sort.oldest' },
  { key: 'status',   labelKey: 'sort.status' },
] as const;

type StatusKey = (typeof STATUS_FILTERS)[number]['key'];
type SortKey = (typeof SORT_OPTIONS)[number]['key'];

function ListCard({ data, expanded, onToggle, timeline }: { data: TrackingCardVM; expanded: boolean; onToggle: () => void; timeline: TimelineEvent[] }) {
  const { t, settings } = useSettings();
  return (
    <div className={`list-card ${expanded ? 'is-expanded' : ''}`} data-id={data.id}>
      <button className="list-card-summary" onClick={onToggle} aria-expanded={expanded}>
        <div className="lc-head">
          <div className="courier">
            <span className="courier-dot" style={{ background: data.courierColor }} />
            {data.courier}
          </div>
          <div className={`status ${data.status}`}>
            <span className="dot" />
            {t(data.statusLabelKey)}
          </div>
        </div>
        <div className="lc-title-row">
          <div>
            <div className="card-title">{data.title}</div>
            <div className="card-id">{data.id}</div>
          </div>
          <div className="lc-eta">
            <div className="label">{t('card.eta')}</div>
            <div className="value">{formatEta(data._etaRaw, settings.lang)}</div>
          </div>
        </div>
        <div className="track-line">
          <div className="track-line-fill" style={{ width: `${data.progress * 100}%` }} />
        </div>
        <div className="track-stops">
          {data.stopKeys.map((key, i) => (
            <span key={key} className={`stop ${i < data.activeStop ? 'active' : ''}`}>{t(key)}</span>
          ))}
        </div>
        <div className="lc-chev" aria-hidden="true">{expanded ? '▴' : '▾'}</div>
      </button>
      <div className="lc-details" style={{ maxHeight: expanded ? 900 : 0, opacity: expanded ? 1 : 0 }}>
        <div className="lc-details-inner">
          <div className="lc-detail-head">
            <div className="lc-detail-title">{t('tp.timeline')}</div>
            <div className="lc-detail-sub">{t('tp.timelineSub', { n: timeline.filter((e) => e.complete).length })}</div>
          </div>
          <ol className="timeline">
            {timeline.map((e, i) => (
              <li key={i} className={`tl-item ${e.complete ? 'is-complete' : 'is-pending'} ${i === 0 ? 'is-latest' : ''}`}>
                <div className="tl-dot" aria-hidden="true"><span className="tl-glyph">{e.icon}</span></div>
                <div className="tl-body">
                  <div className="tl-label">{t(e.labelKey)}</div>
                  <div className="tl-meta">
                    <span className="tl-city">{e.cityKey ? t(e.cityKey) : e.city}</span>
                    <span className="tl-dot-sep">·</span>
                    <span className="tl-time">{formatEventTime(e.time, settings.lang)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Toolbar({ status, onStatus, sort, onSort, counts }: { status: StatusKey; onStatus: (s: StatusKey) => void; sort: SortKey; onSort: (s: SortKey) => void; counts: Record<string, number> }) {
  const { t } = useSettings();
  return (
    <div className="tp-toolbar">
      <div className="tp-chips">
        {STATUS_FILTERS.map((f) => (
          <button key={f.key} className={`tp-chip ${status === f.key ? 'active' : ''}`} onClick={() => onStatus(f.key)}>
            {t(f.labelKey)}
            <span className="tp-chip-count">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>
      <div className="tp-sort">
        <label htmlFor="sort">{t('sort.label')}</label>
        <select id="sort" value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
          {SORT_OPTIONS.map((s) => <option key={s.key} value={s.key}>{t(s.labelKey)}</option>)}
        </select>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="tp-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="list-card sk">
          <div className="sk-line sk-w-30" />
          <div className="sk-line sk-w-70" />
          <div className="sk-line sk-w-40" />
          <div className="sk-bar" />
          <div className="sk-line sk-w-50" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ status, onReset }: { status: StatusKey; onReset: () => void }) {
  const { t } = useSettings();
  const isAll = status === 'all';
  const labelKey: Record<string, string> = {
    'processing': 'filter.processing',
    'in-transit': 'filter.inTransit',
    'out-for-delivery': 'filter.outForDelivery',
    'delivered': 'filter.delivered',
  };
  return (
    <div className="tp-empty">
      <div className="tp-empty-art" aria-hidden="true"><div className="tp-empty-box" /></div>
      <div className="tp-empty-title">
        {isAll ? t('empty.noOrders') : t('empty.noMatch', { filter: t(labelKey[status] ?? 'filter.all').toLowerCase() })}
      </div>
      <div className="tp-empty-sub">{isAll ? t('empty.subNoOrders') : t('empty.subNoMatch')}</div>
      {!isAll && <button className="tp-empty-btn" onClick={onReset}>{t('empty.clearFilter')}</button>}
    </div>
  );
}

export default function Tracking() {
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TrackingCardVM[]>([]);
  const [source, setSource] = useState<'api' | 'fallback' | null>(null);
  const [status, setStatus] = useState<StatusKey>('all');
  const [sort, setSort] = useState<SortKey>('eta-asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    fetchTrackingAll().then((res) => {
      if (cancelled) return;
      setItems(res.items);
      setSource(res.source);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || !items.length) return;
    const deepId = searchParams.get('id');
    if (!deepId) return;
    if (!items.find((x) => x.id === deepId)) return;
    setExpandedId(deepId);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-id="${CSS.escape(deepId)}"]`) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        const target = rect.top + window.scrollY - Math.max(0, (window.innerHeight - rect.height) / 2);
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    });
  }, [loading, items, searchParams]);

  // tracking-page-specific body background
  useEffect(() => {
    document.body.classList.add('tp-body');
    return () => { document.body.classList.remove('tp-body'); };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    STATUS_FILTERS.forEach((f) => { if (f.key !== 'all') c[f.key] = 0; });
    items.forEach((it) => { c[it.status] = (c[it.status] || 0) + 1; });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    let out = status === 'all' ? items : items.filter((it) => it.status === status);
    out = [...out];
    const statusRank: Record<string, number> = { 'out-for-delivery': 0, 'in-transit': 1, 'processing': 2, 'delivered': 3 };
    out.sort((a, b) => {
      if (sort === 'eta-asc')  return (a._etaRaw || '').localeCompare(b._etaRaw || '');
      if (sort === 'eta-desc') return (b._etaRaw || '').localeCompare(a._etaRaw || '');
      if (sort === 'newest')   return (b._updatedRaw || '').localeCompare(a._updatedRaw || '');
      if (sort === 'oldest')   return (a._updatedRaw || '').localeCompare(b._updatedRaw || '');
      if (sort === 'status')   return (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9);
      return 0;
    });
    return out;
  }, [items, status, sort]);

  const timelineCache = useRef(new Map<string, TimelineEvent[]>());
  const getTimeline = (item: TrackingCardVM) => {
    if (!timelineCache.current.has(item.id)) {
      timelineCache.current.set(item.id, buildTimeline(item));
    }
    return timelineCache.current.get(item.id)!;
  };

  const parcelNoun = items.length === 1 ? t('tp.parcel') : t('tp.parcels');

  return (
    <div className="tp">
      <Navbar padded ctaType="back" />

      <header className="tp-header">
        <div className="tp-h-left">
          <div className="eyebrow">
            <span className="pulse" />
            {loading ? t('tp.loading') : t('tp.parcelCount', { n: items.length, noun: parcelNoun })}
          </div>
          <h1 className="tp-title">
            {t('tp.title.your')} <span className="tp-title-accent">{t('tp.title.parcels')}</span>.
          </h1>
          <p className="tp-sub">{t('tp.subtitle')}</p>
        </div>
        {source && (
          <div className="tp-source">
            <span className="tp-src-dot" style={{ background: source === 'api' ? 'var(--good)' : 'var(--accent)' }} />
            {source === 'api' ? t('card.source.api') : t('card.source.fallback')}
          </div>
        )}
      </header>

      <Toolbar status={status} onStatus={setStatus} sort={sort} onSort={setSort} counts={counts} />

      <main className="tp-main">
        {loading && <Skeleton />}
        {!loading && filtered.length === 0 && <EmptyState status={status} onReset={() => setStatus('all')} />}
        {!loading && filtered.length > 0 && (
          <div className="tp-grid">
            {filtered.map((item) => (
              <ListCard
                key={item.id}
                data={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                timeline={getTimeline(item)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="tp-footer">
        <span>{t('footer.version')}</span>
        <span>{t('footer.refresh')}</span>
      </footer>
    </div>
  );
}
