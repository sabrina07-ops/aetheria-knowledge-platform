import React from 'react';
import { X, Bookmark, Share2, Compass, ExternalLink, Orbit, Check, Sparkles } from 'lucide-react';
import { Article } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES } from '../../../data/categories';

interface SpaceDrawerProps {
  article: Article | null;
  onClose: () => void;
}

export const SpaceDrawer: React.FC<SpaceDrawerProps> = ({ article, onClose }) => {
  const { language, toggleBookmark, user, t } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const isBookmarked = user?.savedArticles.includes(article.id) || false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="space-observatory-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        id="space-drawer-panel"
        className="w-full max-w-2xl bg-slate-950 border-l border-sky-500/30 text-slate-100 h-full overflow-y-auto flex flex-col relative cosmic-stars shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Observatory Top HUD */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md border-b border-sky-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-sky-400 animate-spin" />
            <span className="text-[11px] font-mono tracking-widest text-sky-400 uppercase">
              DEEP-FIELD OBSERVATORY // {article.id.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                isBookmarked 
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-sky-300'
              }`}
              title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-sky-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-300 text-xs transition cursor-pointer"
              title={t('shareArticle')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Observatory Banner Image */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0 border-b border-sky-900/40">
          <img
            src={article.coverImage}
            alt={article.title[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Coordinates HUD Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-sky-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/30">
            <span>COORD: {article.metadata?.celestialCoordinates || 'RA 03h 32m, Dec -27° 46′'}</span>
            <span>DIST: {article.metadata?.distanceFromEarth || 'Cosmic Deep Field'}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                {CATEGORIES.space.name[language]}
              </span>
              <span className="text-xs text-slate-400">
                {article.readingTime} {t('readingTime')} • {article.publicationDate}
              </span>
            </div>

            <h1 className="font-cosmic text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
              {article.title[language]}
            </h1>

            <p className="text-sm sm:text-base text-sky-200/80 font-light mt-2 leading-relaxed">
              {article.subtitle[language]}
            </p>

            <div className="text-xs text-slate-400 mt-2 font-mono">
              {t('author')}: {article.author}
            </div>
          </div>

          {/* Astronomical Telemetry Box */}
          {article.metadata && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Constellation / Field</span>
                <span className="text-sky-300 font-semibold">{article.metadata.constellation || 'Deep Space'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Observational Mode</span>
                <span className="text-sky-300 font-semibold">{article.metadata.missionType || 'Infrared Spectrograph'}</span>
              </div>
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-invert prose-sky max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            {article.fullContent[language].split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-bold font-cosmic text-sky-300 pt-4 border-b border-sky-900/30 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-2 border-sky-400 pl-4 py-1.5 my-3 italic text-sky-200 bg-sky-950/20 rounded-r">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-300">
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

          {/* Academic Citations / Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className="pt-6 border-t border-sky-900/40 text-xs">
              <h4 className="font-mono text-sky-400 uppercase tracking-wider text-[11px] mb-2">
                {t('sourcesAndReferences')}
              </h4>
              <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-sky-500">•</span>
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
