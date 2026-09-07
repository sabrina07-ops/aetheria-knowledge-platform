import React from 'react';
import { 
  Orbit, 
  Cpu, 
  Palette, 
  BookOpen, 
  Atom, 
  ArrowRight, 
  Sparkles, 
  Instagram, 
  Feather, 
  ExternalLink,
  Compass,
  Bookmark,
  Library,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const HomeSection: React.FC = () => {
  const { articles, language, navigateTo, openArticle, toggleBookmark, user, theme, t } = useApp();

  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const recentArticles = articles.slice(0, 6);
  const isDark = theme === 'dark';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'space': return <Orbit className="w-4 h-4 text-sky-400" />;
      case 'technology': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'art': return <Palette className="w-4 h-4 text-amber-400" />;
      case 'science': return <Atom className="w-4 h-4 text-emerald-400" />;
      case 'resources': return <Library className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div 
      id="home-cosmic-realm" 
      className={`min-h-screen transition-colors duration-200 relative pb-24 ${
        isDark ? 'bg-slate-950 text-slate-100 cosmic-stars' : 'bg-[#faf8f5] text-stone-900'
      }`}
    >
      {/* Hero Section */}
      <section className={`relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b ${
        isDark ? 'border-slate-900' : 'border-stone-200 bg-gradient-to-b from-stone-100/60 to-transparent'
      }`}>
        {/* Ambient Glow */}
        {isDark && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-purple-900/15 via-sky-900/15 to-amber-900/15 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider shadow-sm border ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-amber-300' 
              : 'bg-white border-stone-300 text-amber-700 shadow-sm'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>UNIVERSAL KNOWLEDGE ARCHIVE // AETHERIA</span>
          </div>

          <h1 className={`font-classical text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight ${
            isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400' 
              : 'text-stone-900'
          }`}>
            {t('heroTitle')}
          </h1>

          <p className={`font-literary italic text-base sm:text-xl max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-stone-700'
          }`}>
            {t('heroQuote')}
          </p>

          <p className={`text-xs sm:text-sm max-w-xl mx-auto font-light ${
            isDark ? 'text-slate-400' : 'text-stone-600'
          }`}>
            {t('heroDesc')}
          </p>

          {/* Quick Action Navigation Buttons (All Domains) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => navigateTo('space')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-sky-400 text-stone-800 shadow-sm'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-sky-400" />
              <span>{CATEGORIES.space.name[language]}</span>
            </button>

            <button
              onClick={() => navigateTo('technology')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-cyan-400 text-stone-800 shadow-sm'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{CATEGORIES.technology.name[language]}</span>
            </button>

            <button
              onClick={() => navigateTo('art')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-400 text-stone-800 shadow-sm'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{CATEGORIES.art.name[language]}</span>
            </button>

            <button
              onClick={() => navigateTo('literature')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-purple-400 text-stone-800 shadow-sm'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>{CATEGORIES.literature.name[language]}</span>
            </button>

            <button
              onClick={() => navigateTo('science')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-emerald-500 text-stone-800 shadow-sm'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-emerald-400" />
              <span>{CATEGORIES.science.name[language]}</span>
            </button>

            <button
              onClick={() => navigateTo('resources')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200' 
                  : 'bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-400 text-stone-800 shadow-sm'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('navResources')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Treatise Spotlight */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="font-classical text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {t('featuredTreatise')}
            </h2>
          </div>

          <div 
            onClick={() => {
              navigateTo(featuredArticle.category);
              openArticle(featuredArticle);
            }}
            className={`group relative rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50' 
                : 'bg-white border-stone-200 hover:border-amber-500/60 shadow-stone-200/50'
            }`}
          >
            <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              <span className="absolute top-4 left-4 text-xs font-mono px-3 py-1 rounded-full bg-slate-950/80 text-amber-300 border border-amber-500/40">
                {CATEGORIES[featuredArticle.category]?.name[language]}
              </span>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className={`flex items-center gap-2 text-xs font-mono ${
                  isDark ? 'text-slate-400' : 'text-stone-500'
                }`}>
                  <span>{featuredArticle.readingTime} {t('readingTime')}</span>
                  <span>•</span>
                  <span>{featuredArticle.publicationDate}</span>
                </div>

                <h3 className={`font-classical text-2xl sm:text-3xl font-bold transition leading-tight ${
                  isDark ? 'text-slate-100 group-hover:text-amber-300' : 'text-stone-900 group-hover:text-amber-700'
                }`}>
                  {featuredArticle.title[language]}
                </h3>

                <p className="text-sm font-literary italic text-amber-600 dark:text-amber-400">
                  {featuredArticle.subtitle[language]}
                </p>

                <p className={`text-xs sm:text-sm line-clamp-4 leading-relaxed pt-2 ${
                  isDark ? 'text-slate-400' : 'text-stone-600'
                }`}>
                  {featuredArticle.shortDescription[language]}
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isDark ? 'border-slate-800 text-amber-400' : 'border-stone-200 text-amber-700'
              }`}>
                <span>{t('readArticle')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Portals to Knowledge (All Realms) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={`font-classical text-2xl sm:text-3xl font-bold ${
            isDark ? 'text-slate-100' : 'text-stone-900'
          }`}>
            {t('exploreWorlds')}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-lg mx-auto ${
            isDark ? 'text-slate-400' : 'text-stone-600'
          }`}>
            {language === 'ar'
              ? 'لكل حقل معرفي لغته البصرية، وبيئته التفاعلية الخاصة المصممة لتلائم جوهره الفكري.'
              : 'Each domain is crafted with its own dedicated atmosphere, visual styling, and interactive reading mechanics.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(CATEGORIES).map(cat => {
            const count = articles.filter(a => a.category === cat.key).length;
            return (
              <div
                key={cat.key}
                onClick={() => navigateTo(cat.key)}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden shadow-sm ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90' 
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200'
                  }`}>
                    {getCategoryIcon(cat.key)}
                  </div>
                  <h3 className={`font-classical text-lg font-bold transition ${
                    isDark ? 'text-slate-100 group-hover:text-amber-300' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    {cat.name[language]}
                  </h3>
                  <p className={`text-xs mt-2 line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-stone-600'
                  }`}>
                    {cat.tagline[language]}
                  </p>
                </div>

                <div className={`relative z-10 pt-4 border-t flex items-center justify-between text-xs font-mono ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-stone-200 text-stone-500'
                }`}>
                  <span>{count} {language === 'ar' ? 'دراسة / سيرة' : 'treatises'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instagram Bio Connection Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-3xl p-8 sm:p-10 border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
          isDark 
            ? 'bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-pink-950/30 border-purple-800/40' 
            : 'bg-gradient-to-r from-purple-50 via-white to-pink-50 border-purple-200'
        }`}>
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border ${
              isDark 
                ? 'bg-purple-900/40 border-purple-700/50 text-purple-300' 
                : 'bg-purple-100 border-purple-300 text-purple-800'
            }`}>
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>@aetheria.archive // INSTAGRAM ARCHIVE</span>
            </div>
            <h3 className={`font-classical text-2xl font-bold ${
              isDark ? 'text-slate-100' : 'text-stone-900'
            }`}>
              {t('instagramConnectionTitle')}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-stone-600'
            }`}>
              {t('instagramConnectionDesc')}
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs tracking-wide shadow-lg flex items-center gap-2.5 transition shrink-0 group"
          >
            <Instagram className="w-4 h-4 group-hover:scale-110 transition" />
            <span>{t('followInstagram')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Latest Dispatches Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center justify-between mb-8 pb-4 border-b ${
          isDark ? 'border-slate-900' : 'border-stone-200'
        }`}>
          <div>
            <h2 className={`font-classical text-2xl font-bold ${
              isDark ? 'text-slate-100' : 'text-stone-900'
            }`}>
              {t('latestDispatches')}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
              {language === 'ar' ? 'أحدث المنشورات والسير في مختلف فروع الأرشيف' : 'Recently curated treatises and biographies across all realms'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map(art => (
            <div
              key={art.id}
              onClick={() => {
                navigateTo(art.category);
                openArticle(art);
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex gap-4 group ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
              }`}
            >
              <img
                src={art.coverImage}
                alt={art.title[language]}
                className={`w-20 h-20 rounded-xl object-cover border shrink-0 ${
                  isDark ? 'border-slate-800' : 'border-stone-200'
                }`}
              />
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-semibold">
                    {CATEGORIES[art.category]?.name[language]}
                  </span>
                  <h4 className={`text-xs font-semibold transition line-clamp-1 mt-0.5 ${
                    isDark ? 'text-slate-200 group-hover:text-amber-300' : 'text-stone-800 group-hover:text-amber-700'
                  }`}>
                    {art.title[language]}
                  </h4>
                  <p className={`text-[11px] line-clamp-2 mt-1 ${
                    isDark ? 'text-slate-400' : 'text-stone-600'
                  }`}>
                    {art.shortDescription[language]}
                  </p>
                </div>
                <div className={`text-[10px] font-mono mt-2 ${
                  isDark ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  {art.readingTime} {t('readingTime')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
