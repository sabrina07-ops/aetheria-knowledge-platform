import React, { useState } from 'react';
import { Cpu, Terminal, Zap, Shield, ArrowRight, Bookmark, Layers, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CyberReader } from './tech/CyberReader';
import { Article } from '../../types';

export const TechSection: React.FC = () => {
  const { articles, language, selectedArticle, openArticle, closeArticle, toggleBookmark, user, t } = useApp();
  const [activeTag, setActiveTag] = useState<string>('all');

  const techArticles = articles.filter(a => a.category === 'technology');
  const allTags = Array.from(new Set(techArticles.flatMap(a => a.tags)));

  const filteredArticles = activeTag === 'all'
    ? techArticles
    : techArticles.filter(a => a.tags.includes(activeTag));

  return (
    <div id="tech-realm-view" className="min-h-screen bg-slate-950 text-slate-100 cyber-grid relative pb-24">
      {/* Cyber Hero Banner */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-cyan-900/40 overflow-hidden">
        <div className="absolute -top-10 right-10 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-md border border-cyan-800/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>DIGITAL FRONTIERS // MAGAZINE & ARCHIVE</span>
            </div>
            <div className="text-[11px] font-mono text-cyan-500/80">
              CORE STATUS: OPTIMAL // ARCHIVE SYNCHRONIZED
            </div>
          </div>

          <h1 className="font-cyber text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 tracking-wider">
            {language === 'ar' ? 'التكنولوجيا والعالم الرقمي' : 'Technology & Digital Frontiers'}
          </h1>
          
          <p className="text-sm sm:text-base text-cyan-100/80 max-w-3xl mt-3 font-mono leading-relaxed">
            {language === 'ar'
              ? 'أرشيف تحليلي ومجلة فكرية تستكشف ثورات الذكاء الاصطناعي، وفيزياء الحوسبة الكمومية، وعبقرية المخترعين، وفلسفة الوجود الرقمي.'
              : 'An intellectual magazine and digital archive dissecting artificial cognition, quantum supremacy, seminal inventors, and the architecture of the synthetic future.'}
          </p>

          {/* Filter Tags */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setActiveTag('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer ${
                activeTag === 'all'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/90 text-cyan-300 hover:bg-slate-800 border border-cyan-900/60'
              }`}
            >
              {t('allTags')} ({techArticles.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                  activeTag === tag
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900/90 text-cyan-300 hover:bg-slate-800 border border-cyan-900/60'
                }`}
              >
                // {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Tech Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(art => {
            const isBookmarked = user?.savedArticles.includes(art.id);
            return (
              <article
                key={art.id}
                id={`tech-card-${art.id}`}
                onClick={() => openArticle(art)}
                className="group relative rounded-xl bg-slate-950/80 border border-cyan-900/50 hover:border-cyan-400/80 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
              >
                {/* Tech Image with HUD corner */}
                <div className="relative h-56 w-full overflow-hidden border-b border-cyan-900/40">
                  <img
                    src={art.coverImage}
                    alt={art.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Civilizational Impact Badge */}
                  {art.metadata?.impactScore && (
                    <div className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/90 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>IMPACT: {art.metadata.impactScore}</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(art.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-300 hover:text-white transition"
                    title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 mb-2">
                      <span>{art.readingTime} {t('readingTime')}</span>
                      <span>•</span>
                      <span>{art.publicationDate}</span>
                    </div>

                    <h3 className="font-cyber text-lg sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition line-clamp-2">
                      {art.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mt-2 font-mono leading-relaxed">
                      {art.shortDescription[language]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-cyan-900/40 flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>EXECUTE ARCHIVE READ</span>
                    <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Cyber Reader Modal */}
      <CyberReader article={selectedArticle} onClose={closeArticle} />
    </div>
  );
};
