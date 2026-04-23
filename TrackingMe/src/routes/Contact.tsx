import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/lib/i18n';

const FAQ = [
  { qKey: 'contact.faq.q1', aKey: 'contact.faq.a1' },
  { qKey: 'contact.faq.q2', aKey: 'contact.faq.a2' },
  { qKey: 'contact.faq.q3', aKey: 'contact.faq.a3' },
  { qKey: 'contact.faq.q4', aKey: 'contact.faq.a4' },
];

export default function Contact() {
  const { t } = useSettings();
  const [open, setOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar padded ctaType="back" />

      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px 56px' }}>
        <div className="eyebrow">
          <span className="pulse" style={{ background: 'var(--cool)' }} />
          {t('contact.badge')}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '24px 0 16px' }}>
          {t('contact.title.prefix')} <span style={{ color: 'var(--accent-deep)' }}>{t('contact.title.accent')}</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 500, lineHeight: 1.6 }}>
          {t('contact.subtitle')}
        </p>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>

        {/* Contact form */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 24, padding: 40 }}>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{t('contact.form.successTitle')}</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>{t('contact.form.successDesc')}</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ marginTop: 8, background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 999, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {t('contact.form.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>{t('contact.form.title')}</h2>
              {[
                { key: 'name', label: t('contact.form.name'), type: 'text', placeholder: t('contact.form.namePlaceholder') },
                { key: 'email', label: t('contact.form.email'), type: 'email', placeholder: t('contact.form.emailPlaceholder') },
                { key: 'subject', label: t('contact.form.subject'), type: 'text', placeholder: t('contact.form.subjectPlaceholder') },
              ].map((f) => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    required
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-solid)', color: 'var(--ink)', fontSize: 15, outline: 'none', fontFamily: 'inherit', transition: 'border-color .15s' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{t('contact.form.message')}</label>
                <textarea
                  placeholder={t('contact.form.messagePlaceholder')}
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-solid)', color: 'var(--ink)', fontSize: 15, outline: 'none', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color .15s' }}
                />
              </div>
              <button type="submit" style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 999, padding: '14px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'transform .15s, background .15s' }}>
                {t('contact.form.send')}
              </button>
            </form>
          )}
        </div>

        {/* Info + FAQ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Contact info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '📬', labelKey: 'contact.info.email', value: 'support@trackme.io' },
              { icon: '💬', labelKey: 'contact.info.chat', value: t('contact.info.chatValue') },
              { icon: '⏱️', labelKey: 'contact.info.response', value: t('contact.info.responseValue') },
            ].map((item) => (
              <div key={item.labelKey} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(item.labelKey)}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginTop: 2 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: '0 0 16px' }}>{t('contact.faq.title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ.map((f, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--ink)', fontWeight: 500, fontSize: 15, fontFamily: 'inherit', textAlign: 'left' }}
                  >
                    {t(f.qKey)}
                    <span style={{ fontSize: 18, color: 'var(--ink-soft)', flexShrink: 0, marginLeft: 12, transition: 'transform .2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open === i && (
                    <div style={{ padding: '0 18px 16px', color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
                      {t(f.aKey)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
