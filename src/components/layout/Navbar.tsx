import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Menu, 
  X, 
  Cpu, 
  Orbit, 
  Palette, 
  BookOpen, 
  Atom, 
  Bookmark, 
  ShieldCheck,
  Library
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    currentSection, 
    navigateTo, 
    user, 
    setAuthModalOpen, 
    setProfileModalOpen, 
    setSearchOpen,
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    t
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { key: 'home', label: t('navHome'), icon: Compass },
    { key: 'space', label: CATEGORIES.space.name[language], icon: Orbit },
    { key: 'technology', label: CATEGORIES.technology.name[language], icon: Cpu },
    { key: 'art', label: CATEGORIES.art.name[language], icon: Palette },
    { key: 'literature', label: CATEGORIES.literature.name[language], icon: BookOpen },
    { key: 'science', label: CATEGORIES.science.name[language], icon: Atom },
    { key: 'resources', label: t('navResources'), icon: Library },
  ];

  return (
    <header 
      id="main-navbar" 
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-100'
          : 'bg-[#fbfaf8]/95 border-stone-200/90 text-stone-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs ${
            theme === 'dark'
              ? 'bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-purple-500/20 border-slate-700/80 group-hover:border-amber-400/60'
              : 'bg-gradient-to-tr from-amber-500/15 via-sky-500/15 to-purple-500/15 border-stone-300 group-hover:border-amber-500'
          }`}>
            <Compass className="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div>
            <span className={`font-classical tracking-wider text-xl font-bold ${
              theme === 'dark'
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-slate-100 to-sky-200'
                : 'text-stone-900'
            }`}>
              {t('siteTitle')}
            </span>
            <span className={`block text-[10px] font-cosmic tracking-widest uppercase ${
              theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
            }`}>
              {language === 'ar' ? 'مجمع المعرفة وسير الخالدين' : 'Universal Knowledge & Biographies'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav-links" className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.key;
            return (
              <button
                key={item.key}
                id={`nav-link-${item.key}`}
                onClick={() => navigateTo(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-slate-800 text-amber-300 shadow-xs border border-slate-700'
                      : 'bg-amber-100 text-amber-900 shadow-xs border border-amber-300 font-semibold'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive 
                    ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-700')
                    : (theme === 'dark' ? 'text-slate-400' : 'text-stone-400')
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Search, Notifs, Lang, Theme, User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Search Button */}
          <button
            id="nav-search-trigger"
            onClick={() => setSearchOpen(true)}
            title={t('searchShortcutHint')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-white border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-300 shadow-xs'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-400" />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">⌘K</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="nav-notifications-trigger"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'bg-white border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-300 shadow-xs'
              }`}
              aria-label={t('notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Language Switcher */}
          <button
            id="nav-lang-switcher"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-500/40 hover:text-amber-300'
                : 'bg-white border-stone-200 text-stone-700 hover:border-amber-500/40 hover:text-amber-700 shadow-xs'
            }`}
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Mode Switcher */}
          <button
            id="nav-theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40'
                : 'bg-white border-stone-200 text-amber-700 hover:text-amber-900 hover:border-amber-300 shadow-xs'
            }`}
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-700" />}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <button
              id="nav-user-profile-button"
              onClick={() => setProfileModalOpen(true)}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs ${
                theme === 'dark'
                  ? 'bg-slate-800/90 border-slate-700 hover:border-amber-400/50 text-slate-100'
                  : 'bg-white border-stone-200 hover:border-amber-400/50 text-stone-900 shadow-xs'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium max-w-[90px] truncate">{user.username}</span>
              {user.role === 'admin' && (
                <span title="Admin Curator">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                </span>
              )}
            </button>
          ) : (
            <button
              id="nav-sign-in-button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs transition shadow-xs cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('signIn')}</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`xl:hidden p-2 rounded-lg border cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white border-stone-200 text-stone-700 hover:text-stone-950 shadow-xs'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer" 
          className={`xl:hidden border-t px-4 py-4 space-y-2 transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 bg-slate-950/98'
              : 'border-stone-200 bg-white/98 shadow-md'
          }`}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.key;
            return (
              <button
                key={item.key}
                id={`mobile-nav-link-${item.key}`}
                onClick={() => {
                  navigateTo(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-900'
                      : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive
                    ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-700')
                    : (theme === 'dark' ? 'text-slate-400' : 'text-stone-400')
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              id="mobile-nav-admin"
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{t('navAdmin')}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
