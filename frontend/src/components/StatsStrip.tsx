import type { Order } from '../types/order';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Store, CheckCircle, FileText } from 'lucide-react';

interface StatsStripProps {
  orders: Order[];
}

export default function StatsStrip({ orders }: StatsStripProps) {
  const { t } = useTranslation();

  const counts = {
    total: orders.length,
    onTheWay: orders.filter(o => o.status === 'on-the-way').length,
    readyForPickup: orders.filter(o => o.status === 'ready-for-pickup').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    infoReceived: orders.filter(o => o.status === 'order-info-received').length,
  };

  const stats = [
    { label: t('stats.total'), value: counts.total, icon: <Package size={16} />, color: 'text-foreground', bg: 'bg-card', border: 'border-border/60', iconBg: 'bg-muted' },
    { label: t('stats.onTheWay'), value: counts.onTheWay, icon: <Truck size={16} />, color: 'text-blue-600', bg: 'bg-blue-50/60 dark:bg-blue-900/10', border: 'border-blue-200/50 dark:border-blue-800/30', iconBg: 'bg-blue-100 dark:bg-blue-900/40' },
    { label: t('stats.readyForPickup'), value: counts.readyForPickup, icon: <Store size={16} />, color: 'text-amber-600', bg: 'bg-amber-50/60 dark:bg-amber-900/10', border: 'border-amber-200/50 dark:border-amber-800/30', iconBg: 'bg-amber-100 dark:bg-amber-900/40' },
    { label: t('stats.delivered'), value: counts.delivered, icon: <CheckCircle size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50/60 dark:bg-emerald-900/10', border: 'border-emerald-200/50 dark:border-emerald-800/30', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    { label: t('stats.infoReceived'), value: counts.infoReceived, icon: <FileText size={16} />, color: 'text-slate-600', bg: 'bg-slate-50/60 dark:bg-slate-900/10', border: 'border-slate-200/50 dark:border-slate-800/30', iconBg: 'bg-slate-100 dark:bg-slate-900/40' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden group transition-all duration-300 ${stat.bg} ${stat.border} backdrop-blur-md border rounded-2xl p-4 shadow-sm hover:shadow-md`}
        >
          {/* Subtle Glow Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/40 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.color} shadow-sm group-hover:scale-105 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-2xl font-black tracking-tighter ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5 leading-tight">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
