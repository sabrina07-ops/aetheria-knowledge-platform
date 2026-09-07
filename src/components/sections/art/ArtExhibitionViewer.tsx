import React, { useState } from 'react';
import { X, Bookmark, Share2, Palette, Check, Eye, Frame, Compass } from 'lucide-react';
import { Article } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES } from '../../../data/categories';

interface ArtExhibitionViewerProps {
  article: Article | null;
  onClose: () => void;
}

export const ArtExhibitionViewer: React.FC<ArtExhibitionViewerProps> = ({ article, onClose }) => {
  const { language, toggleBookmark, user, t } = useApp();
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const isBookmarked = user?.savedArticles.includes(article.id) || false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="art-gallery-viewer-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        id="art-salon-exhibition"
        className="w-full max-w-5xl bg-stone-900 border border-amber-500/30 rounded-2xl text-stone-100 max-h-[92vh] overflow-y-auto flex flex-col relative art-canvas-texture shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Gallery Top Rail */}
        <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur-md border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-classical tracking-widest text-amber-300 uppercase">
              GALLERY SALON // {article.metadata?.galleryRoom || 'MAIN ROTUNDA'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-amber-300'
              }`}
              title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-300 text-xs transition cursor-pointer"
              title={t('shareArticle')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-stone-300" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Masterpiece Showcase with Museum Matting */}
        <div className="p-6 sm:p-10 flex flex-col items-center bg-stone-950/60 border-b border-stone-800">
          <div className="p-3 sm:p-5 rounded-xl bg-stone-900 border-4 border-amber-700/40 shadow-2xl max-w-3xl w-full">
            <div className="relative overflow-hidden rounded-lg shadow-inner bg-stone-950">
              <img
                src={article.coverImage}
                alt={article.title[language]}
                className="w-full max-h-[480px] object-contain mx-auto"
              />
            </div>
          </div>

          {/* Museum Exhibition Plaque */}
          <div className="mt-6 p-4 sm:p-6 rounded-xl bg-stone-900/90 border border-amber-500/30 max-w-xl w-full shadow-lg text-center">
            <h2 className="font-classical text-xl sm:text-2xl font-bold text-amber-100 tracking-wide">
              {article.title[language]}
            </h2>
            <p className="text-xs text-amber-300/80 font-literary italic mt-1">
              {article.subtitle[language]}
            </p>
            <div className="mt-3 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 font-classical">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.metadata?.artworkMedium || 'Oil on Canvas'}</span>
              <span>•</span>
              <span>{article.metadata?.period || 'Nineteenth Century'}</span>
            </div>
          </div>
        </div>

        {/* Curatorial Essay & Art History Analysis */}
        <div className="p-6 sm:p-12 space-y-6 flex-1 max-w-3xl mx-auto w-full">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-classical text-amber-400">
              <span className="uppercase tracking-widest font-bold">CURATORIAL MONOGRAPH</span>
              <span>•</span>
              <span>{article.readingTime} {t('readingTime')}</span>
            </div>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-literary italic border-l-2 border-amber-500/40 pl-4 py-1">
              {article.shortDescription[language]}
            </p>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert prose-amber max-w-none text-xs sm:text-sm text-stone-300 leading-relaxed space-y-4 font-literary">
            {article.fullContent[language].split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-classical text-lg sm:text-xl font-bold text-amber-200 pt-6 border-b border-stone-800 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-2 border-amber-400 pl-4 py-2 my-4 italic text-amber-100 bg-amber-950/20 rounded-r font-literary">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-stone-300 text-xs">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx}>{line.replace(/^[-*0-9.]+\s*/, '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Sources & Catalog Raisonné */}
          {article.sources && article.sources.length > 0 && (
            <div className="pt-8 border-t border-stone-800 text-xs font-classical">
              <h4 className="text-amber-400 uppercase tracking-wider text-[11px] mb-2 font-bold">
                {t('sourcesAndReferences')}
              </h4>
              <ul className="space-y-1 text-stone-400 text-[11px]">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-amber-500">§</span>
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
