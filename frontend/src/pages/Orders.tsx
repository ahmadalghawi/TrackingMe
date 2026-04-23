import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchOrders } from '../services/api';
import type { Order, OrderStatus } from '../types/order';
import OrderCard from '../components/OrderCard';
import TrackingSearch from '../components/TrackingSearch';
import { Package, Truck, CheckCircle, LayoutGrid, RefreshCw, XCircle } from 'lucide-react';

type FilterStatus = OrderStatus | 'all';

const FILTERS: { key: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'all',                 label: 'filters.all',           icon: <LayoutGrid size={13} /> },
  { key: 'on-the-way',         label: 'filters.onTheWay',      icon: <Truck size={13} /> },
  { key: 'ready-for-pickup',   label: 'filters.readyForPickup', icon: <Package size={13} /> },
  { key: 'delivered',          label: 'filters.delivered',     icon: <CheckCircle size={13} /> },
];

export default function Orders() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');

  const loadOrders = useCallback(async (force = false) => {
    setLoading(true);
    setApiError(false);
    try {
      const data = await fetchOrders(force);
      setOrders(data);
    } catch (error) {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(false);
  }, [loadOrders]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
    else setSearchQuery(''); // Clear if param is gone
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.parcel_id.toLowerCase().includes(q) ||
        order.sender.toLowerCase().includes(q) ||
        order.location_name.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {});
  };

  const clearFilters = () => {
    setActiveFilter('all');
    handleSearch('');
  };

  // Summary stats
  const stats = useMemo(() => ({
    all: orders.length,
    'on-the-way': orders.filter(o => o.status === 'on-the-way').length,
    'ready-for-pickup': orders.filter(o => o.status === 'ready-for-pickup').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* ── Atmospheric background (matches Home) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/4 rounded-[100%] blur-[140px]" />
      </div>

      {/* ── Page Header ── */}
      <div className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  Live Fleet
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadOrders(true)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
                    title="Refresh orders"
                  >
                    <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                  {(activeFilter !== 'all' || searchQuery !== '') && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/5 hover:bg-destructive/10 text-destructive text-[10px] font-bold tracking-widest uppercase transition-all animate-in fade-in slide-in-from-left-2 duration-300"
                      title="Clear filters"
                    >
                      <XCircle size={10} />
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-[800] tracking-tighter text-foreground leading-[1]">
                {t('orders.title')}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                {loading && orders.length === 0 ? 'Loading orders…' : `${orders.length} shipments tracked`}
              </p>
            </div>

            <div className="sm:w-72">
              <TrackingSearch
                variant="inline"
                initialValue={searchQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {t('orders.error')} — showing cached data
            </div>
          )}

          {/* ── Filter tabs ── */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map(({ key, label, icon }) => {
              const count = stats[key as keyof typeof stats] ?? orders.length;
              const active = activeFilter === key;
              return (
                <button
                  key={key}
                  id={`filter-${key}`}
                  onClick={() => setActiveFilter(key)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                      : 'bg-card/60 text-muted-foreground border-border/60 hover:bg-card hover:text-foreground hover:border-border'
                  }`}
                >
                  {icon}
                  {t(`orders.${label}`)}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold font-mono ${
                    active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Orders grid ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            {/* Parchment-tinted spinner */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
              <div className="absolute inset-[6px] rounded-full bg-primary/10 flex items-center justify-center">
                <Package size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase">
              {t('orders.loading')}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-20 h-20 bg-card/50 border border-border rounded-2xl flex items-center justify-center text-4xl">
              📭
            </div>
            <div>
              <p className="text-foreground font-semibold text-lg">{t('orders.noResults')}</p>
              <p className="text-muted-foreground text-sm mt-1">{t('orders.noResultsHint')}</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-5">
              {filteredOrders.length} shipment{filteredOrders.length !== 1 ? 's' : ''} found
            </p>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
