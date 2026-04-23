import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TrackingSearchProps {
  initialValue?: string;
  onSearch?: (value: string) => void;
  variant?: 'hero' | 'inline';
}

export default function TrackingSearch({ initialValue = '', onSearch, variant = 'hero' }: TrackingSearchProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/orders?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="inline-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('orders.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          id="inline-search-btn"
          type="submit"
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          {t('hero.searchButton')}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <input
            id="hero-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 bg-card/80 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          id="hero-search-btn"
          type="submit"
          className="px-8 py-4 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-bold text-base rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer"
        >
          {t('hero.searchButton')}
        </button>
      </div>
    </form>
  );
}
