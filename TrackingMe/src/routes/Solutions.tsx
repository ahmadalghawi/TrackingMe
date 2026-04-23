import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/lib/i18n';

const SOLUTIONS = [
  {
    icon: '🏪',
    titleKey: 'solutions.card.ecom.title',
    descKey: 'solutions.card.ecom.desc',
    tags: ['E-commerce', 'Shopify', 'WooCommerce'],
    cta: '/pricing',
  },
  {
    icon: '🏢',
    titleKey: 'solutions.card.enterprise.title',
    descKey: 'solutions.card.enterprise.desc',
    tags: ['API Access', 'SLA', 'Custom branding'],
    cta: '/contact',
  },
  {
    icon: '🚀',
    titleKey: 'solutions.card.startup.title',
    descKey: 'solutions.card.startup.desc',
    tags: ['Free tier', 'Sandbox', 'Webhooks'],
    cta: '/pricing',
  },
  {
    icon: '📦',
    titleKey: 'solutions.card.logistics.title',
    descKey: 'solutions.card.logistics.desc',
    tags: ['Bulk import', 'Analytics', 'Multi-carrier'],
    cta: '/contact',
  },
];

const HOW_IT_WORKS = [
  { num: '01', titleKey: 'solutions.how.step1.title', descKey: 'solutions.how.step1.desc' },
  { num: '02', titleKey: 'solutions.how.step2.title', descKey: 'solutions.how.step2.desc' },
  { num: '03', titleKey: 'solutions.how.step3.title', descKey: 'solutions.how.step3.desc' },
];

export default function Solutions() {
  const { t } = useSettings();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar padded ctaType="back" />

      {/* Hero */}
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px 72px' }}>
        <div className="eyebrow">
          <span className="pulse" style={{ background: 'var(--cool)' }} />
          {t('solutions.badge')}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '24px 0 16px', maxWidth: 640 }}>
          {t('solutions.title.prefix')} <span style={{ color: 'var(--accent-deep)' }}>{t('solutions.title.accent')}</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 560, lineHeight: 1.6 }}>
          {t('solutions.subtitle')}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/pricing" className="cta" style={{ padding: '13px 24px', fontSize: 15 }}>{t('solutions.cta.pricing')}</Link>
          <Link to="/contact" style={{ padding: '13px 24px', fontSize: 15, borderRadius: 999, border: '1px solid var(--line)', color: 'var(--ink)', textDecoration: 'none', background: 'var(--surface)', fontWeight: 500 }}>{t('solutions.cta.contact')}</Link>
        </div>
      </header>

      {/* Solution cards */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {SOLUTIONS.map((s) => (
            <div key={s.titleKey} style={{ padding: 32, background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 20, transition: 'box-shadow .2s' }}>
              <div style={{ fontSize: 40 }}>{s.icon}</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px' }}>{t(s.titleKey)}</h3>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{t(s.descKey)}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {s.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent-deep)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={s.cta} style={{ marginTop: 'auto', fontSize: 14, color: 'var(--accent-deep)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                {t('solutions.learnMore')} →
              </Link>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', textAlign: 'center', letterSpacing: '-0.015em', marginBottom: 48 }}>
            {t('solutions.how.title')}
          </h2>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} style={{ flex: '1 1 240px', maxWidth: 280, position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', color: 'var(--accent-deep)', marginBottom: 16 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px' }}>{t(step.titleKey)}</h3>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{t(step.descKey)}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', color: 'var(--line)', fontSize: 24, display: 'none' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
