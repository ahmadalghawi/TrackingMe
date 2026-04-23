import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/lib/i18n';
import { buildTimeline, formatEta, formatEventTime } from '@/lib/tracking';
import type { LayoutMode, TimelineEvent, TrackingCardVM } from '@/lib/types';

interface CardsProps {
  visible: boolean;
  layout: LayoutMode;
  onReset: () => void;
  items: TrackingCardVM[];
  source: 'api' | 'fallback' | null;
}

interface Transform { tx: number; ty: number; rz: number; delay: number; z: number; }

function getCardTransforms(layout: LayoutMode, index: number, total: number): Transform {
  if (layout === 'fan') {
    const step = index - (total - 1) / 2;
    return { tx: step * 240, ty: Math.abs(step) * 16 - 8, rz: step * 4, delay: 200 + index * 120, z: 10 - Math.abs(step) };
  }
  if (layout === 'stack') {
    const step = index - (total - 1) / 2;
    return { tx: step * 8, ty: step * 100, rz: 0, delay: 200 + index * 140, z: 10 - Math.abs(step) };
  }
  const cols = 2;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return { tx: (col - 0.5) * 310, ty: (row - 0.5) * 230, rz: 0, delay: 200 + index * 100, z: 10 - index };
}

function TrackingCardView({ data, style, onClick }: { data: TrackingCardVM; style: CSSProperties; onClick?: (e: React.MouseEvent) => void }) {
  const { t, settings } = useSettings();
  const eta = formatEta(data._etaRaw, settings.lang);
  return (
    <div className="card" style={style} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="card-head">
        <div className="courier">
          <span className="courier-dot" style={{ background: data.courierColor }} />
          {data.courier}
        </div>
        <div className={`status ${data.status}`}>
          <span className="dot" />
          {t(data.statusLabelKey)}
        </div>
      </div>
      <div className="card-title">{data.title}</div>
      <div className="card-id">{data.id}</div>
      <div className="track-line">
        <div className="track-line-fill" style={{ width: `${data.progress * 100}%` }} />
      </div>
      <div className="track-stops">
        {data.stopKeys.map((key, i) => (
          <span key={key} className={`stop ${i < data.activeStop ? 'active' : ''}`}>{t(key)}</span>
        ))}
      </div>
      <div className="card-meta">
        <div><div className="label">{t('card.eta')}</div><div className="value">{eta}</div></div>
        <div><div className="label">{t('card.location')}</div><div className="value">{data.location}</div></div>
      </div>
    </div>
  );
}

function ExpandedCardDetail({ data, timeline, onClose }: { data: TrackingCardVM; timeline: TimelineEvent[]; onClose: () => void }) {
  const { t, settings } = useSettings();
  const eta = formatEta(data._etaRaw, settings.lang);
  return (
    <div className="expanded-card" role="dialog" aria-label={`Details for ${data.title}`}>
      <button className="exp-close" onClick={onClose} aria-label="Close">×</button>
      <div className="exp-head">
        <div>
          <div className="courier">
            <span className="courier-dot" style={{ background: data.courierColor }} />
            {data.courier}
          </div>
          <div className="exp-title">{data.title}</div>
          <div className="card-id">{data.id}</div>
        </div>
        <div className={`status ${data.status}`}>
          <span className="dot" />
          {t(data.statusLabelKey)}
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
      <div className="exp-meta">
        <div><div className="label">{t('card.eta')}</div><div className="value">{eta}</div></div>
        <div><div className="label">{t('card.location')}</div><div className="value">{data.location}</div></div>
      </div>
      <div className="exp-tl-head">
        <div className="exp-tl-title">{t('exp.recent')}</div>
        <div className="exp-tl-sub">{t('exp.scanEvents', { n: timeline.filter((e) => e.complete).length })}</div>
      </div>
      <ol className="timeline">
        {timeline.slice(0, 4).map((e, i) => (
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
      <Link className="exp-cta" to={`/tracking?id=${encodeURIComponent(data.id)}`}>
        {t('exp.viewFull')}
        <span className="exp-cta-arrow">→</span>
      </Link>
    </div>
  );
}

export default function TrackingCards({ visible, layout, onReset, items, source }: CardsProps) {
  const { t } = useSettings();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!visible) setExpandedId(null); }, [visible]);

  const expandedItem = expandedId ? items.find((d) => d.id === expandedId) ?? null : null;
  const timeline = expandedItem ? buildTimeline(expandedItem) : [];

  return (
    <div
      className={`cards-layer ${visible ? 'is-visible' : ''} ${expandedId ? 'has-expanded' : ''}`}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity .5s ease' }}
    >
      <div className="cards-frame" ref={frameRef}>
        {items.map((d, i) => {
          const tr = getCardTransforms(layout, i, items.length);
          const isThis = expandedId === d.id;
          const isOther = !!expandedId && !isThis;
          return (
            <TrackingCardView
              key={d.id}
              data={d}
              onClick={(e) => { e.preventDefault(); setExpandedId(isThis ? null : d.id); }}
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-140px',
                marginTop: '-100px',
                transform: `translate(${tr.tx}px, ${tr.ty}px) rotate(${tr.rz}deg) scale(${visible ? (isOther ? 0.85 : 1) : 0.7})`,
                transitionDelay: `${visible && !expandedId ? tr.delay : 0}ms`,
                zIndex: isThis ? 20 : tr.z,
                opacity: isOther ? 0 : 1,
                pointerEvents: isOther ? 'none' : 'auto',
              }}
            />
          );
        })}

        {expandedItem && (
          <ExpandedCardDetail data={expandedItem} timeline={timeline} onClose={() => setExpandedId(null)} />
        )}

        <button
          className="reset-btn"
          onClick={onReset}
          style={{ opacity: expandedId ? 0 : undefined, pointerEvents: expandedId ? 'none' : undefined }}
        >
          <span style={{ display: 'inline-block', transform: 'rotate(-90deg)' }}>↺</span>
          {t('card.packItBack')}
        </button>

        {source && !expandedId && (
          <div className="source-chip">
            <span className="src-dot" style={{ background: source === 'api' ? 'var(--good)' : 'var(--accent)' }} />
            {source === 'api' ? t('card.source.api') : t('card.source.fallback')}
          </div>
        )}
      </div>
    </div>
  );
}
