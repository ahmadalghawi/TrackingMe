import { useSettings } from '@/lib/i18n';

export default function SettingsToggles() {
  const { settings, setSettings, t } = useSettings();
  const isDark = settings.theme === 'dark';
  const isSv = settings.lang === 'sv';
  return (
    <div className="nav-toggles">
      <button
        className="nav-toggle"
        onClick={() => setSettings({ theme: isDark ? 'light' : 'dark' })}
        title={isDark ? t('nav.theme.light') : t('nav.theme.dark')}
        aria-label={isDark ? t('nav.theme.light') : t('nav.theme.dark')}
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
      <button
        className="nav-toggle nav-lang"
        onClick={() => setSettings({ lang: isSv ? 'en' : 'sv' })}
        title={isSv ? 'English' : 'Svenska'}
        aria-label={isSv ? 'Switch to English' : 'Byt till svenska'}
      >
        <span className={`nav-lang-opt ${!isSv ? 'active' : ''}`}>EN</span>
        <span className="nav-lang-sep">/</span>
        <span className={`nav-lang-opt ${isSv ? 'active' : ''}`}>SV</span>
      </button>
    </div>
  );
}
