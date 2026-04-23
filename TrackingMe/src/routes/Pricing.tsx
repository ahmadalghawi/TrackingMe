import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/lib/i18n';

export default function Pricing() {
  const { t } = useSettings();

  return (
    <div className="tp">
      <Navbar padded ctaType="back" />
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px 60px' }}>
        <div className="eyebrow">
          <span className="pulse" style={{ background: 'var(--accent)' }} />
          Simple Pricing
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '24px 0 16px' }}>
          Track without <span style={{ color: 'var(--accent-deep)' }}>limits</span>.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
          Choose a plan that scales with your shipping volume. No hidden fees, no surprises.
        </p>
      </header>
      <main style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 100 }}>
        {/* Starter Plan */}
        <div style={{ width: 340, padding: 40, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--line)', boxShadow: '0 12px 32px -12px oklch(0 0 0 / 0.08)' }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>Starter</h3>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8, fontSize: 15, lineHeight: 1.5 }}>Perfect for small businesses sending a few packages.</p>
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            $29<span style={{ fontSize: 16, color: 'var(--ink-soft)', fontWeight: 500 }}>/mo</span>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '16px 0 32px', padding: 0, listStyle: 'none', color: 'var(--ink-soft)', fontSize: 15 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> Up to 500 parcels/mo</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> 10 courier integrations</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> Standard support</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.5 }}><span style={{ fontWeight: 600 }}>✗</span> Custom branding</li>
          </ul>
          <Link to="/tracking" className="cta" style={{ width: '100%', textAlign: 'center', marginTop: 'auto', padding: '14px 20px', borderRadius: 12, fontSize: 15, background: 'var(--surface-solid)', color: 'var(--ink)', border: '1px solid var(--line)' }}>
            Get Started
          </Link>
        </div>

        {/* Pro Plan */}
        <div style={{ width: 340, padding: 40, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--surface-solid)', borderRadius: 24, border: '2px solid var(--accent)', position: 'relative', boxShadow: '0 24px 48px -12px oklch(0.5 0.2 var(--accent-h) / 0.15)' }}>
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'var(--bg)', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Most Popular
          </div>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>Pro</h3>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8, fontSize: 15, lineHeight: 1.5 }}>For growing teams that need reliable tracking at scale.</p>
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            $99<span style={{ fontSize: 16, color: 'var(--ink-soft)', fontWeight: 500 }}>/mo</span>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '16px 0 32px', padding: 0, listStyle: 'none', color: 'var(--ink-soft)', fontSize: 15 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> Up to 5,000 parcels/mo</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> All 1,200+ couriers</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> Priority email support</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>✓</span> Custom branded tracking</li>
          </ul>
          <Link to="/tracking" className="cta" style={{ width: '100%', textAlign: 'center', background: 'var(--ink)', color: 'var(--bg)', marginTop: 'auto', padding: '14px 20px', borderRadius: 12, fontSize: 15 }}>
            Go Pro
          </Link>
        </div>
      </main>
    </div>
  );
}
