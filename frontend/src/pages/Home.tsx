import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchOrders } from '../services/api';
import type { Order } from '../types/order';
import StatsStrip from '../components/StatsStrip';
import ThreeBox from '../components/ThreeBox';
import FlyoutCard from '../components/FlyoutCard';
import '../components/Box3DStyles.css';
import { ArrowRight, Package, Truck, Box as BoxIcon, RotateCcw, LayoutDashboard } from 'lucide-react';

type AnimationPhase = 'closed' | 'ripping' | 'opening' | 'revealed';

export default function Home() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>('closed');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders().then(data => {
      setOrders(data);
      setLoaded(true);
    });
  }, []);

  const handleBoxClick = useCallback(() => {
    if (phase !== 'closed') return;
    setPhase('ripping');
    setTimeout(() => {
      setPhase('opening');
      setTimeout(() => { setPhase('revealed'); }, 1400);
    }, 700);
  }, [phase]);

  const handleReset = useCallback(() => { setPhase('closed'); }, []);

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-primary/5 rounded-[100%] blur-[120px]" />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex-1 flex flex-col items-center pt-10 px-4 sm:px-6">

        {/* ── Live badge ── */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/40 backdrop-blur-md border border-border/50 text-foreground/80 font-mono text-[11px] tracking-wider uppercase mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          {loaded ? `${orders.length} packages in flight · live` : 'Connecting to fleet...'}
        </div>

        {/* ── Hero wordmark ─────────────────────────────────────────────── */}
        <div className="text-center mb-2 select-none">
          {/* Eyebrow label */}
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">
            Yellow Corporation
          </p>

          {/* Main wordmark — split treatment */}
          <h1
            className="leading-none tracking-[-0.04em] relative inline-block"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {/* "Track" — heavy, foreground */}
            <span
              className="text-[76px] sm:text-[104px] lg:text-[128px] font-black text-foreground"
              style={{ letterSpacing: '-0.04em' }}
            >
              Track
            </span>

            {/* "Me" — gradient, italic, outlined effect */}
            <span
              className="text-[76px] sm:text-[104px] lg:text-[128px] font-black italic relative"
              style={{
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, oklch(0.60 0.22 55) 0%, oklch(0.50 0.20 30) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Me
              {/* Underline accent */}
              <span
                className="absolute left-0 -bottom-2 h-[4px] rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, oklch(0.60 0.22 55), transparent)',
                }}
              />
            </span>
          </h1>

          {/* Subtitle only — no button here */}
          <p className="mt-5 text-muted-foreground text-base sm:text-lg font-medium max-w-md mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* ── 3D Box Stage ── */}
        <div className="relative w-full max-w-5xl h-[450px] sm:h-[560px] mt-2 flex items-center justify-center">
          {/* Ground shadow */}
          <div className={`ground-shadow ${phase !== 'closed' ? 'is-open-state' : ''}`} />

          {/* 3D Box */}
          <ThreeBox
            isOpen={phase === 'opening' || phase === 'revealed'}
            isRipping={phase === 'ripping'}
            isHidden={false}
            onClick={handleBoxClick}
          />

          {/* ── "Open the box" hand-drawn annotation (top-right of box) ── */}
          <div
            className={`absolute top-[3%] right-[35%] sm:right-[35%] lg:right-[35%] pointer-events-none select-none transition-all duration-600 ${phase !== 'closed' ? 'opacity-0 -translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100'
              }`}
            style={{ zIndex: 5 }}
          >
            {/* Label + arrow as one tilted unit */}
            <div style={{ transform: 'rotate(-12deg)', transformOrigin: 'top right' }}>
              {/* Handwritten text */}
              <span
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'oklch(0.45 0.18 55)',
                  display: 'block',
                  textAlign: 'right',
                  lineHeight: 1,
                  marginBottom: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                open the box!
              </span>

              {/* SVG: organic curved arrow pointing down-left toward the box */}
              <svg
                width="90"
                height="72"
                viewBox="0 0 90 72"
                fill="none"
                style={{ display: 'block', marginLeft: 'auto' }}
              >
                {/* Main curve: starts top-right, arcs down and left */}
                <path
                  d="M 82 6 C 72 12, 55 14, 42 28 C 30 40, 20 52, 10 64"
                  stroke="oklch(0.55 0.20 55)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Arrowhead: two short strokes at the tip */}
                <path
                  d="M 10 64 L 22 60"
                  stroke="oklch(0.55 0.20 55)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 64 L 14 52"
                  stroke="oklch(0.55 0.20 55)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Old bottom hint (keep for mid-screen fallback) */}
          <div className={`hint ${phase !== 'closed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className="k">Click</span> to open shipment
          </div>

          {/* ── Cards Reveal Layer ── */}
          <div className={`cards-layer ${phase === 'revealed' ? 'is-visible' : ''}`}>
            <div className="cards-frame flex items-center justify-center">
              {orders.slice(0, 4).map((order, idx) => (
                <FlyoutCard
                  key={order.id}
                  order={order}
                  index={idx}
                  total={Math.min(orders.length, 4)}
                />
              ))}

              {/* Action Buttons beneath cards */}
              <div 
                className={`absolute bottom-[-60px] flex flex-col items-center gap-4 transition-all duration-1000 delay-500 ${
                  phase === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                {/* Refined "View Orders" CTA */}
                <button
                  onClick={() => navigate('/orders')}
                  className="group relative overflow-hidden px-8 py-3 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary font-bold text-sm tracking-wide shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 pointer-events-auto"
                >
                  <LayoutDashboard size={15} />
                  View All Orders
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Reset link */}
                <button
                  onClick={handleReset}
                  className="group flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold tracking-[0.3em] uppercase py-1 pointer-events-auto transition-colors duration-200"
                >
                  <RotateCcw size={10} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                  Pack it back up
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Content (stats + feature cards) ── */}
      {loaded && orders.length > 0 && phase === 'closed' && (
        <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-foreground">Fleet Status</h2>
              <p className="text-sm text-muted-foreground font-medium">Real-time logistics overview</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent mx-8 hidden md:block" />
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              View Full List <ArrowRight size={12} />
            </button>
          </div>

          <StatsStrip orders={orders} />

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: <BoxIcon size={20} />,
                title: 'Real-Time Tracking',
                desc: 'Every mile accounted for with live fleet updates and GPS precision.',
                accent: 'bg-blue-500/10 dark:bg-blue-500/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
              },
              {
                icon: <Package size={20} />,
                title: 'Secure Logistics',
                desc: 'Multi-layer verification and blockchain manifest for high-value shipments.',
                accent: 'bg-amber-500/10 dark:bg-amber-500/20',
                iconColor: 'text-amber-600 dark:text-amber-400',
              },
              {
                icon: <Truck size={20} />,
                title: 'Fleet Network',
                desc: 'Direct access to global and local courier nodes across 40+ countries.',
                accent: 'bg-emerald-500/10 dark:bg-emerald-500/20',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group relative p-8 rounded-[2rem] bg-card border border-border/60 backdrop-blur-xl hover:bg-card/80 hover:border-border transition-all duration-500 shadow-sm hover:shadow-md"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[50px] rounded-full ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${f.accent} border border-border/40 flex items-center justify-center ${f.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Infrastructure Details <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-12" />
    </main>
  );
}
