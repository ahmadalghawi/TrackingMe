import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '@/lib/i18n';
import SettingsToggles from './SettingsToggles';

interface NavbarProps {
  padded?: boolean;
  ctaType?: 'start' | 'back';
}

export default function Navbar({ padded = false, ctaType = 'start' }: NavbarProps) {
  const { t } = useSettings();
  const location = useLocation();
  const isTracking = location.pathname.startsWith('/tracking');

  return (
    <nav className={`nav ${padded ? 'nav-padded' : ''}`} style={padded ? { padding: '28px 0' } : undefined}>
      <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
        <div className="brand-dot" />
        TrackMe
      </Link>
      <ul>
        <li><Link to="/tracking" className={location.pathname.startsWith('/tracking') ? 'active' : ''}>{t('nav.tracking')}</Link></li>
        <li><Link to="/couriers" className={location.pathname === '/couriers' ? 'active' : ''}>{t('nav.couriers')}</Link></li>
        <li><Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>{t('nav.pricing')}</Link></li>
        <li><Link to="/solutions" className={location.pathname === '/solutions' ? 'active' : ''}>{t('nav.solutions')}</Link></li>
        <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t('nav.contact')}</Link></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SettingsToggles />
        {ctaType === 'start' ? (
          <Link className="cta" to="/tracking">{t('nav.startTracking')}</Link>
        ) : (
          <Link className="cta" to="/">{t('nav.back')}</Link>
        )}
      </div>
    </nav>
  );
}
