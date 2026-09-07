import React, { useState } from 'react';
import { Orbit, Compass, Radio, Sparkles, ArrowRight, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpaceDrawer } from './space/SpaceDrawer';
import { Article } from '../../types';

export const SpaceSection: React.FC = () => {
  const { articles, language, selectedArticle, openArticle, closeArticle, toggleBookmark, user, t } = useApp();
  const [activeTag, setActiveTag] = useState<string>('all');

  const spaceArticles = articles.filter(a => a.category === 'space');
  const allTags = Array.from(new Set(spaceArticles.flatMap(a => a.tags)));

  const filteredArticles = activeTag === 'all'
    ? spaceArticles
    : spaceArticles.filter(a => a.tags.includes(activeTag));

  return (
    <div id="space-realm-view" className="min-h-screen bg-slate-950 text-slate-100 cosmic-stars relative pb-24">
      {/* Space Hero Atmosphere */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-sky-900/30 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/60">
              <Orbit className="w-3.5 h-3.5 animate-spin" />
              <span>COSMIC TELEMETRY ARCHIVE // ASTROPHYSICS</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              COORDINATES: 00h 42m 44s | +41° 16′ 09″
            </div>
          </div>

          <h1 className="font-cosmic text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-indigo-100 to-slate-200 tracking-wider">
            {language === 'ar' ? 'أعماق الفضاء وعلم الفلك' : 'Deep Space & Astrophysics'}
          </h1>
          
          <p className="text-sm sm:text-base text-sky-200/80 max-w-3xl mt-3 font-light leading-relaxed">
            {language === 'ar'
              ? 'رحلة استكشافية في فيزياء النجوم، وتلسكوبات العصر الذهبي، وتطور المجرات منذ فجر الكون العظيم.'
              : 'Scholarly explorations into stellar nucleosynthesis, early-universe chronologies, gravitational waves, and the cosmic tapestry.'}
          </p>

          {/* Filter Tags */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setActiveTag('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTag === 'all'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900/80 text-sky-300 hover:bg-slate-800 border border-sky-900/50'
              }`}
            >
              {t('allTags')} ({spaceArticles.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                  activeTag === tag
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-sky-300 hover:bg-slate-800 border border-sky-900/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(art => {
            const isBookmarked = user?.savedArticles.includes(art.id);
            return (
              <article
                key={art.id}
                id={`space-card-${art.id}`}
                onClick={() => openArticle(art)}
                className="group relative rounded-2xl bg-slate-900/70 border border-sky-900/40 hover:border-sky-500/60 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-sky-500/10"
              >
                {/* Image & Overlay */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={art.coverImage}
                    alt={art.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  {art.metadata?.missionType && (
                    <div className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-sky-300 border border-sky-500/30">
                      {art.metadata.missionType}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(art.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-950/80 border border-sky-500/30 text-sky-300 hover:text-sky-100 transition"
                    title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-sky-400' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-sky-400 mb-2">
                      <span>{art.readingTime} {t('readingTime')}</span>
                      <span>•</span>
                      <span>{art.publicationDate}</span>
                    </div>

                    <h3 className="font-cosmic text-lg sm:text-xl font-bold text-slate-100 group-hover:text-sky-300 transition line-clamp-2">
                      {art.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mt-2 font-light leading-relaxed">
                      {art.shortDescription[language]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-sky-900/30 flex items-center justify-between text-xs font-mono text-sky-400">
                    <span>LAUNCH OBSERVATION</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Space Observatory Side Drawer */}
      <SpaceDrawer article={selectedArticle} onClose={closeArticle} />
    </div>
  );
};
