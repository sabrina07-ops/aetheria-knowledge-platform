import React, { useState } from 'react';
import { Palette, Frame, Eye, ArrowRight, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArtExhibitionViewer } from './art/ArtExhibitionViewer';
import { Article } from '../../types';

export const ArtSection: React.FC = () => {
  const { articles, language, selectedArticle, openArticle, closeArticle, toggleBookmark, user, t } = useApp();
  const [activeTag, setActiveTag] = useState<string>('all');

  const artArticles = articles.filter(a => a.category === 'art');
  const allTags = Array.from(new Set(artArticles.flatMap(a => a.tags)));

  const filteredArticles = activeTag === 'all'
    ? artArticles
    : artArticles.filter(a => a.tags.includes(activeTag));

  return (
    <div id="art-realm-view" className="min-h-screen bg-stone-950 text-stone-100 art-canvas-texture relative pb-24">
      {/* Museum Salon Hero */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-classical text-amber-300 bg-stone-900/80 px-3 py-1 rounded-full border border-amber-800/60 shadow-sm">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>GRAND GALLERY // SALON DES BEAUX-ARTS</span>
            </div>
            <div className="text-[11px] font-classical text-stone-400">
              PERMANENT CURATION • AESTHETICS & ICONOGRAPHY
            </div>
          </div>

          <h1 className="font-classical text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 tracking-wider">
            {language === 'ar' ? 'الفنون البصرية والمتاحف' : 'Visual Arts & Masterpieces'}
          </h1>
          
          <p className="text-sm sm:text-base text-stone-300 max-w-3xl mt-3 font-literary italic leading-relaxed">
            {language === 'ar'
              ? 'تأملات نقدية وبصرية في روائع الفن العالمي، من سحر الانطباعية الفرنسية إلى عمق الرمزية وعمارة النهضة.'
              : 'Curatorial reflections and monographs on humanity’s pinnacle aesthetic achievements, from Monet’s light studies to classical architectural harmony.'}
          </p>

          {/* Filter Tags */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setActiveTag('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-classical transition cursor-pointer ${
                activeTag === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {t('allTags')} ({artArticles.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-classical transition cursor-pointer whitespace-nowrap ${
                  activeTag === tag
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                § {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Museum Salon Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art, idx) => {
            const isBookmarked = user?.savedArticles.includes(art.id);
            return (
              <article
                key={art.id}
                id={`art-card-${art.id}`}
                onClick={() => openArticle(art)}
                className="group relative rounded-2xl bg-stone-900/80 border border-amber-900/30 hover:border-amber-500/60 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer shadow-xl hover:shadow-amber-500/10"
              >
                {/* Museum Matting & Artwork Frame */}
                <div className="p-3 bg-stone-950 border-b border-stone-800">
                  <div className="relative h-60 w-full overflow-hidden rounded-lg">
                    <img
                      src={art.coverImage}
                      alt={art.title[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60" />

                    {art.metadata?.galleryRoom && (
                      <div className="absolute top-2.5 left-2.5 text-[10px] font-classical uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900/90 text-amber-300 border border-amber-500/30">
                        {art.metadata.galleryRoom}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(art.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-stone-900/90 border border-amber-500/30 text-amber-300 hover:text-white transition"
                      title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Exhibition Plaque Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-classical text-amber-400/90 mb-2">
                      <span>{art.author}</span>
                      <span>{art.readingTime} {t('readingTime')}</span>
                    </div>

                    <h3 className="font-classical text-lg sm:text-xl font-bold text-stone-100 group-hover:text-amber-300 transition line-clamp-2">
                      {art.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-400 line-clamp-3 mt-2 font-literary italic leading-relaxed">
                      {art.shortDescription[language]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs font-classical text-amber-300 group-hover:text-amber-200">
                    <span className="tracking-wider uppercase">ENTER EXHIBITION VIEW</span>
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Art Exhibition Viewer Modal */}
      <ArtExhibitionViewer article={selectedArticle} onClose={closeArticle} />
    </div>
  );
};
