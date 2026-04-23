import { useEffect, useState } from 'react';
import Box3D from '@/components/Box3D';
import Navbar from '@/components/Navbar';
import TrackingCards from '@/components/TrackingCards';
import TweaksPanel from '@/components/TweaksPanel';
import Wordmark from '@/components/Wordmark';
import { useSettings } from '@/lib/i18n';
import { fetchTracking } from '@/lib/tracking';
import type { TrackingCardVM, Tweaks } from '@/lib/types';

const TWEAK_DEFAULTS: Tweaks = {
  layout: 'fan',
  accentHue: 55,
  floatAmp: 10,
  wordmark: 'split',
};

type Phase = 'closed' | 'shaking' | 'ripping' | 'opening' | 'revealed' | 'closing';

export default function Hero() {
  const { t } = useSettings();
  const [phase, setPhase] = useState<Phase>('closed');
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const [items, setItems] = useState<TrackingCardVM[]>([]);
  const [source, setSource] = useState<'api' | 'fallback' | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTracking().then((res) => {
      if (cancelled) return;
      setItems(res.items);
      setSource(res.source);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent-h', String(tweaks.accentHue));
    r.style.setProperty('--float-amp', `${tweaks.floatAmp}px`);
  }, [tweaks.accentHue, tweaks.floatAmp]);

  const handleBoxClick = () => {
    if (phase !== 'closed') return;
    setPhase('shaking');
    setTimeout(() => setPhase('ripping'), 550);
    setTimeout(() => setPhase('opening'), 1100);
    setTimeout(() => setPhase('revealed'), 2100);
  };

  const reset = () => {
    setPhase('closing');
    setTimeout(() => setPhase('closed'), 800);
  };

  const isShaking = phase === 'shaking';
  const isPeeling = phase === 'shaking';
  const isRipping = phase === 'ripping' || phase === 'opening' || phase === 'revealed';
  const isCracking = phase === 'ripping';
  const isOpen = phase === 'opening' || phase === 'revealed';
  const isBoxHidden = phase === 'revealed';
  const showCards = phase === 'revealed';
  const isOpenState = phase !== 'closed' && phase !== 'closing';

  return (
    <div className={`hero ${isOpenState ? 'is-open-state' : ''}`}>
      <Navbar ctaType="start" />

      <section className="stage">
        <div
          className="title-stack"
          style={{
            opacity: showCards ? 0 : 1,
            transform: showCards ? 'translateY(-40px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'all .7s ease',
            pointerEvents: showCards ? 'none' : 'auto',
          }}
        >
          <div className="eyebrow">
            <span className="pulse" />
            {t('hero.badge', { count: items.length || 4 })}
          </div>
          <Wordmark style={tweaks.wordmark} />
          <p className="subtitle">{t('hero.subtitle')}</p>
        </div>

        <div
          className="box-stage"
          style={{
            opacity: showCards ? 0 : 1,
            transition: 'opacity .6s ease',
            pointerEvents: showCards ? 'none' : 'auto',
          }}
        >
          <div className="ground-shadow" />
          <Box3D
            isOpen={isOpen}
            isRipping={isRipping}
            isPeeling={isPeeling}
            isCracking={isCracking}
            isShaking={isShaking}
            isHidden={isBoxHidden}
            onClick={handleBoxClick}
          />
          {phase === 'closed' && (
            <>
              <div className="hint" style={{ top: 'calc(50% + clamp(140px, 20vw, 220px))', bottom: 'auto' }}>
                <span className="k">{t('hero.hint.click')}</span> {t('hero.hint.or')} <span className="k">↵</span> {t('hero.hint.open')}
              </div>
              <div className="open-hint" aria-hidden="true">
                <svg className="open-hint-arrow" viewBox="0 0 180 140" fill="none">
                  <path
                    d="M 10 20 C 40 10, 80 30, 90 60 S 120 110, 165 115"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M 152 108 L 166 116 L 156 126"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="open-hint-label">{t('hero.openTheBox')}</span>
              </div>
            </>
          )}
        </div>

        <TrackingCards
          visible={showCards}
          layout={tweaks.layout}
          onReset={reset}
          items={items}
          source={source}
        />
      </section>

      <div className="stats">
        <div className="stat"><div className="num">247M+</div><div className="lbl">{t('stats.parcels')}</div></div>
        <div className="stat"><div className="num">1,240</div><div className="lbl">{t('stats.couriers')}</div></div>
        <div className="stat"><div className="num">99.98%</div><div className="lbl">{t('stats.uptime')}</div></div>
        <div className="stat"><div className="num">~180ms</div><div className="lbl">{t('stats.latency')}</div></div>
      </div>

      {/* <button
        onClick={() => setTweaksOpen((v) => !v)}
        style={{
          position: 'fixed',
          right: 20,
          top: 20,
          zIndex: 40,
          background: 'var(--ink)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: 999,
          padding: '8px 14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        {tweaksOpen ? '× close' : '◐ tweaks'}
      </button>

      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} />
      )} */}
    </div>
  );
}
