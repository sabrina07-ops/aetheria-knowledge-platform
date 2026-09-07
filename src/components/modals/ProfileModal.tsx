import React, { useState } from 'react';
import { X, Bookmark, Bell, History, LogOut, Check, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const ProfileModal: React.FC = () => {
  const { 
    profileModalOpen, 
    setProfileModalOpen, 
    user, 
    logout, 
    articles, 
    openArticle, 
    navigateTo, 
    toggleBookmark, 
    toggleCategoryFollow, 
    language, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'following' | 'history'>('bookmarks');

  if (!profileModalOpen || !user) return null;

  const savedList = articles.filter(a => user.savedArticles.includes(a.id));
  const historyList = (user.readingHistory || [])
    .map(h => {
      const art = articles.find(a => a.id === h.articleId);
      return art ? { article: art, timestamp: h.timestamp } : null;
    })
    .filter(Boolean) as { article: typeof articles[0]; timestamp: string }[];

  return (
    <div 
      id="profile-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setProfileModalOpen(false)}
    >
      <div 
        id="profile-modal-container"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg border border-amber-400/40">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">{user.username}</h3>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300">
                  <ShieldCheck className="w-3 h-3" />
                  {t('adminBadge')}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {language === 'ar' ? 'انضم إلى الأرشيف في:' : 'Archived since:'}{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('savedTreatises')} ({user.savedArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'following'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الأقسام المتابعة' : 'Followed Realms'} ({user.followedCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'سجل القراءة' : 'Reading Log'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          
          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            savedList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {t('noSavedTreatises')}
              </div>
            ) : (
              savedList.map(art => (
                <div
                  key={art.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div 
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    onClick={() => {
                      setProfileModalOpen(false);
                      navigateTo(art.category);
                      openArticle(art);
                    }}
                  >
                    <img 
                      src={art.coverImage} 
                      alt={art.title[language]} 
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono text-amber-400">
                        {CATEGORIES[art.category]?.name[language]}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200 truncate">
                        {art.title[language]}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {art.subtitle[language]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 p-2 rounded hover:bg-slate-800 transition shrink-0 ml-2 cursor-pointer"
                    title={t('bookmarkedArticle')}
                  >
                    <Bookmark className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
              ))
            )
          )}

          {/* Followed Categories Tab */}
          {activeTab === 'following' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                {t('followCategoriesExplainer')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(CATEGORIES).map(cat => {
                  const isFollowing = user.followedCategories.includes(cat.key);
                  return (
                    <div
                      key={cat.key}
                      onClick={() => toggleCategoryFollow(cat.key)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                        isFollowing
                          ? 'bg-amber-950/20 border-amber-600/50 text-slate-100'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block text-xs font-bold text-slate-200">
                          {cat.name[language]}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate">
                          {cat.tagline[language]}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isFollowing ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                      }`}>
                        {isFollowing && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            historyList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {language === 'ar' ? 'سجل قراءتك فارغ حالياً.' : 'Your reading history is currently empty.'}
              </div>
            ) : (
              historyList.map((item, idx) => (
                <div
                  key={`${item.article.id}_${idx}`}
                  onClick={() => {
                    setProfileModalOpen(false);
                    navigateTo(item.article.category);
                    openArticle(item.article);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-amber-400">
                      {CATEGORIES[item.article.category]?.name[language]}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {item.article.title[language]}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('signOut')}</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => {
                setProfileModalOpen(false);
                navigateTo('admin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs transition cursor-pointer hover:bg-amber-400"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('navAdmin')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
