import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { ThemeToggle } from './ThemeToggle';
import { Package, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'sv' : 'en');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105 shadow-md">
            <Package size={18} />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            TrackMe
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            id="nav-home"
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-muted text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            id="nav-orders"
            to="/orders"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-muted text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            {t('nav.orders')}
          </NavLink>

          <div className="w-px h-6 bg-border mx-2"></div>

          <ThemeToggle />

          <button
            id="lang-toggle"
            onClick={toggleLanguage}
            className="ml-1 px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted border border-border text-xs font-semibold text-foreground transition-all uppercase tracking-wider cursor-pointer shadow-sm"
            title="Toggle language"
          >
            {i18n.language === 'en' ? '🇸🇪 SV' : '🇬🇧 EN'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/95 backdrop-blur-xl border-b border-border ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              }`
            }
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              }`
            }
          >
            {t('nav.orders')}
          </NavLink>
          
          <div className="flex items-center justify-between px-4 pt-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Language</span>
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-muted border border-border text-sm font-bold text-foreground transition-all uppercase tracking-wider shadow-sm"
            >
              {i18n.language === 'en' ? '🇸🇪 Svenska' : '🇬🇧 English'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
