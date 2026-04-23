import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types/order';
import { Package, Truck, CheckCircle, Info, MapPin, Clock, ChevronRight, X } from 'lucide-react';

interface FlyoutCardProps {
  order: Order;
  index: number;
  total: number;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const STATUS_CONFIG = {
  'on-the-way': {
    label: 'In Transit',
    cssClass: 'in-transit',
    icon: <Truck size={10} />,
    progress: 60,
    color: 'oklch(0.55 0.18 235)',
    bg: 'oklch(0.94 0.04 235)',
    dotBg: 'oklch(0.55 0.18 235)',
  },
  'ready-for-pickup': {
    label: 'Ready',
    cssClass: 'out-for-delivery',
    icon: <Package size={10} />,
    progress: 85,
    color: 'var(--accent-deep)',
    bg: 'oklch(0.94 0.06 55)',
    dotBg: 'var(--accent)',
  },
  delivered: {
    label: 'Delivered',
    cssClass: 'delivered',
    icon: <CheckCircle size={10} />,
    progress: 100,
    color: 'oklch(0.40 0.14 155)',
    bg: 'oklch(0.94 0.05 155)',
    dotBg: 'oklch(0.60 0.18 155)',
  },
  'order-info-received': {
    label: 'Processing',
    cssClass: 'processing',
    icon: <Info size={10} />,
    progress: 20,
    color: 'var(--ink-soft)',
    bg: 'oklch(0.95 0.01 80)',
    dotBg: 'var(--ink-soft)',
  },
};

const getStatus = (s: Order['status']) =>
  STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG['order-info-received'];

export default function FlyoutCard({ order, index, total }: FlyoutCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const angleStep = 7;
  const startAngle = -((total - 1) * angleStep) / 2;
  const rz = expanded ? 0 : startAngle + index * angleStep;
  const tx = expanded ? 0 : (index - (total - 1) / 2) * 220;
  const ty = expanded ? 0 : Math.abs(index - (total - 1) / 2) * 18;

  const status = getStatus(order.status);
  const eta = formatDate(order.eta);

  return (
    <div
      className="flyout-card"
      style={{
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        '--rz': `${rz}deg`,
        '--delay': `${index * 120}ms`,
        zIndex: expanded ? 20 : index,
        width: expanded ? 'min(440px, 90vw)' : '280px',
        position: 'absolute',
        cursor: 'pointer',
        transition: 'transform .9s cubic-bezier(.2,.8,.2,1), opacity .6s ease, width .4s ease, z-index 0s',
      } as React.CSSProperties}
      onClick={() => setExpanded(!expanded)}
    >
      {/* ── Card header ── */}
      <div className="card-head" style={{ marginBottom: expanded ? 16 : 14 }}>
        <div className="courier">
          <div className="courier-dot" style={{ backgroundColor: status.dotBg }} />
          {order.sender}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className={`card-status ${status.cssClass}`}
            style={{ background: status.bg, color: status.color }}
          >
            <span className="dot" style={{ background: status.dotBg }} />
            {status.label}
          </span>
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              style={{
                width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--line)',
                background: 'transparent', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Title & ID ── */}
      <h3 className="card-title">{order.user_name}'s Package</h3>
      <div className="card-id">#{order.parcel_id}</div>

      {/* ── Progress bar ── */}
      <div className="track-line">
        <div className="track-line-fill" style={{ width: `${status.progress}%` }} />
      </div>
      <div className="track-stops">
        <span className={`stop ${status.progress >= 20 ? 'active' : ''}`}>Ordered</span>
        <span className={`stop ${status.progress >= 60 ? 'active' : ''}`}>Transit</span>
        <span className={`stop ${status.progress >= 100 ? 'active' : ''}`}>Arrived</span>
      </div>

      {/* ── Compact meta (always visible) ── */}
      <div className="card-meta">
        <div>
          <div className="label"><Clock size={9} style={{ display: 'inline', marginRight: 3 }} />ETA</div>
          <div className="value">{eta}</div>
        </div>
        <div>
          <div className="label"><MapPin size={9} style={{ display: 'inline', marginRight: 3 }} />Location</div>
          <div className="value">{order.location_name}</div>
        </div>
      </div>

      {/* ── Expanded section ── */}
      {expanded && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px dashed var(--line)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}>
          <div>
            <div className="label">Customer</div>
            <div className="value">{order.user_name}</div>
          </div>
          <div>
            <div className="label">Phone</div>
            <div className="value" style={{ fontSize: 12 }}>{order.user_phone}</div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="label">Location ID</div>
            <div className="value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, wordBreak: 'break-all' }}>
              {order.location_id}
            </div>
          </div>
          <div>
            <div className="label">Verified</div>
            <div className="value">{order.verification_required ? '🔒 Required' : '✅ None'}</div>
          </div>
          <div>
            <div className="label">Status OK</div>
            <div className="value">{order.location_status_ok ? '✅ Yes' : '⚠️ No'}</div>
          </div>

          {/* Navigate CTA */}
          <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/orders?search=${order.parcel_id}`);
              }}
              style={{
                width: '100%',
                padding: '10px 0',
                borderRadius: 12,
                background: 'var(--accent)',
                color: 'var(--bg)',
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                letterSpacing: '0.02em',
              }}
            >
              View Full Details
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
