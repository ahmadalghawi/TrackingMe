import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/lib/i18n';

const COURIERS = [
  { name: 'DHL Express', code: 'DHL', color: '#FFCC00', bg: '#1C1C1C', regions: 'Global', tracking: true, api: true, eta: true },
  { name: 'FedEx', code: 'FDX', color: '#FF6200', bg: '#4D148C', regions: 'Global', tracking: true, api: true, eta: true },
  { name: 'UPS', code: 'UPS', color: '#351C15', bg: '#FFB500', regions: 'Global', tracking: true, api: true, eta: true },
  { name: 'PostNord', code: 'PNS', color: '#FFFFFF', bg: '#0057A8', regions: 'Scandinavia', tracking: true, api: true, eta: false },
  { name: 'Royal Mail', code: 'RM', color: '#FFFFFF', bg: '#C00', regions: 'UK', tracking: true, api: false, eta: false },
  { name: 'USPS', code: 'USPS', color: '#FFFFFF', bg: '#0046AD', regions: 'USA', tracking: true, api: true, eta: true },
  { name: 'Amazon Logistics', code: 'AMZL', color: '#FF9900', bg: '#232F3E', regions: 'Global', tracking: true, api: false, eta: true },
  { name: 'Evri', code: 'EVRI', color: '#FFFFFF', bg: '#7C3AED', regions: 'UK', tracking: true, api: true, eta: false },
  { name: 'GLS', code: 'GLS', color: '#2B2E83', bg: '#FFD100', regions: 'Europe', tracking: true, api: true, eta: false },
  { name: 'DB Schenker', code: 'DBS', color: '#FFFFFF', bg: '#E2001A', regions: 'Europe', tracking: true, api: false, eta: false },
  { name: 'Bring', code: 'BRG', color: '#FFFFFF', bg: '#00643C', regions: 'Scandinavia', tracking: true, api: true, eta: false },
  { name: 'TNT', code: 'TNT', color: '#FFFFFF', bg: '#E05206', regions: 'Global', tracking: true, api: false, eta: true },
];

function FeatureDot({ active }: { active: boolean }) {
  return (
    <span style={{
      display: 'inline-block', width: 18, height: 18, borderRadius: '50%',
      background: active ? 'oklch(0.70 0.15 155)' : 'var(--line)',
      boxShadow: active ? '0 0 0 3px oklch(0.70 0.15 155 / 0.2)' : 'none',
    }} />
  );
}

export default function Couriers() {
  const { t } = useSettings();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar padded ctaType="back" />

      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px 48px' }}>
        <div className="eyebrow">
          <span className="pulse" />
          {t('couriers.badge')}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '24px 0 16px' }}>
          {t('couriers.title.prefix')} <span style={{ color: 'var(--accent-deep)' }}>{t('couriers.title.accent')}</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 560, lineHeight: 1.6 }}>
          {t('couriers.subtitle')}
        </p>
      </header>

      {/* Summary stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '0 20px 60px' }}>
        {[
          { num: '1,200+', lbl: t('couriers.stat.carriers') },
          { num: '190', lbl: t('couriers.stat.countries') },
          { num: '99.9%', lbl: t('couriers.stat.uptime') },
        ].map((s) => (
          <div key={s.lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{s.num}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Courier grid */}
      <main style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '0 20px 40px' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('couriers.col.carrier')}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>{t('couriers.col.tracking')}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>{t('couriers.col.api')}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>{t('couriers.col.eta')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {COURIERS.map((c) => (
            <div key={c.code} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px', gap: 12, alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)', transition: 'border-color .15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: c.color, letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace' }}>{c.code}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{c.regions}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}><FeatureDot active={c.tracking} /></div>
              <div style={{ textAlign: 'center' }}><FeatureDot active={c.api} /></div>
              <div style={{ textAlign: 'center' }}><FeatureDot active={c.eta} /></div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, color: 'var(--ink-soft)', fontSize: 14 }}>
          {t('couriers.footer.missing')}{' '}
          <Link to="/contact" style={{ color: 'var(--accent-deep)', fontWeight: 600, textDecoration: 'none' }}>
            {t('couriers.footer.requestIt')}
          </Link>
        </p>
      </main>
    </div>
  );
}
