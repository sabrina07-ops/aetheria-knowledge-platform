import React from 'react';
import { Bell, CheckCheck, X, ArrowRight, Orbit, Cpu, Palette, BookOpen, Atom, Lock, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const NotificationsDrawer: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationsRead, 
    articles, 
    openArticle, 
    navigateTo, 
    language, 
    user,
    setAuthModalOpen,
    t 
  } = useApp();

  if (!notificationsOpen) return null;

  const getIcon = (cat: CategoryKey) => {
    switch (cat) {
      case 'space': return <Orbit className="w-3.5 h-3.5 text-sky-400" />;
      case 'technology': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'art': return <Palette className="w-3.5 h-3.5 text-amber-400" />;
      case 'science': return <Atom className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const handleOpenArticle = (articleId?: string, notifId?: string) => {
    if (notifId) markNotificationsRead(notifId);
    setNotificationsOpen(false);
    if (articleId) {
      const art = articles.find(a => a.id === articleId);
      if (art) {
        navigateTo(art.category);
        openArticle(art);
      }
    }
  };

  return (
    <div 
      id="notifications-dropdown-backdrop"
      className="fixed inset-0 z-50 flex justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs"
      onClick={() => setNotificationsOpen(false)}
    >
      <div 
        id="notifications-panel"
        className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col h-[75vh] max-h-[600px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">{t('notifications')}</h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => markNotificationsRead()}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              title={t('markAllRead')}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('markAllRead')}</span>
            </button>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {!user ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {language === 'ar' ? 'الإشعارات مخصصة للأعضاء فقط' : 'Dispatches for Members Only'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
                {language === 'ar'
                  ? 'سجّل دخولك أو أنشئ حساباً لمتابعة أقسامك المفضلة وتلقي تنبيهات الدراسات والمقالات الجديدة فور نشرها.'
                  : 'Sign in or create an account to follow custom realms and receive real-time dispatches as treatises are published.'}
              </p>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}</span>
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              {t('noNotifications')}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleOpenArticle(notif.articleId, notif.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 group ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-800/60 border-amber-500/30 text-slate-200'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400">
                      {CATEGORIES[notif.category]?.name[language] || notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition line-clamp-1 mt-0.5">
                    {notif.title[language]}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {notif.message[language]}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          {user ? (
            language === 'ar'
              ? 'تصلك هذه التنبيهات بناءً على الأقسام التي تتابعها في ملفك الشخصي.'
              : 'Alerts are dispatched automatically based on followed realms in your scholar profile.'
          ) : (
            language === 'ar'
              ? 'احرص على إنشاء حساب للبقاء على اطلاع دائم.'
              : 'Join as a scholar to receive updates directly.'
          )}
        </div>
      </div>
    </div>
  );
};
