import { type OrderStatus } from '../types/order';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  'delivered': {
    bg: 'bg-emerald-100/80 border border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
  },
  'on-the-way': {
    bg: 'bg-blue-100/80 border border-blue-200 dark:bg-blue-500/15 dark:border-blue-500/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-600 dark:bg-blue-400',
  },
  'ready-for-pickup': {
    bg: 'bg-amber-100/80 border border-amber-200 dark:bg-amber-500/15 dark:border-amber-500/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-600 dark:bg-amber-400',
  },
  'order-info-received': {
    bg: 'bg-slate-100/80 border border-slate-200 dark:bg-slate-500/15 dark:border-slate-500/30',
    text: 'text-slate-700 dark:text-slate-400',
    dot: 'bg-slate-600 dark:bg-slate-400',
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1 text-xs'
    : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {t(`status.${status}`)}
    </span>
  );
}
