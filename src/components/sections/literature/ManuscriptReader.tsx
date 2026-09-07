import React, { useState } from 'react';
import { X, Bookmark, Share2, BookOpen, Check, Feather, Type, Quote } from 'lucide-react';
import { Article } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES } from '../../../data/categories';

interface ManuscriptReaderProps {
  article: Article | null;
  onClose: () => void;
}

export const ManuscriptReader: React.FC<ManuscriptReaderProps> = ({ article, onClose }) => {
  const { language, toggleBookmark, user, t } = useApp();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'scholar'>('normal');

  if (!article) return null;

  const isBookmarked = user?.savedArticles.includes(article.id) || false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-base sm:text-lg leading-relaxed';
      case 'scholar': return 'text-lg sm:text-xl leading-loose';
      default: return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div 
      id="manuscript-reader-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        id="manuscript-parchment-folio"
        className="w-full max-w-4xl bg-[#1c1917] border border-amber-800/40 rounded-2xl text-[#f5f5f4] max-h-[92vh] overflow-y-auto flex flex-col relative parchment-bg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Manuscript Navigation Bar */}
        <div className="sticky top-0 z-20 bg-[#1c1917]/95 backdrop-blur-md border-b border-amber-900/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-literary tracking-wider text-amber-200 uppercase">
              ARCHIVUM LITTERARUM // {article.author.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-900/80 px-2 py-1 rounded-lg border border-stone-800 text-xs">
              <Type className="w-3.5 h-3.5 text-stone-400" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'normal' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'large' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('scholar')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'scholar' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                A++
              </button>
            </div>

            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-amber-300'
              }`}
              title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 text-xs transition cursor-pointer"
              title={t('shareArticle')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Parchment Foliage & Decorative Header */}
        <div className="p-6 sm:p-12 space-y-8 flex-1 max-w-3xl mx-auto w-full">
          {/* Manuscript Title Card */}
          <div className="text-center pb-8 border-b-2 border-amber-900/30 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-classical uppercase tracking-widest text-amber-400">
              <span>{CATEGORIES.literature.name[language]}</span>
              <span>•</span>
              <span>{article.readingTime} {t('readingTime')}</span>
            </div>

            <h1 className="font-literary text-2xl sm:text-4xl font-bold text-amber-100 tracking-wide leading-tight">
              {article.title[language]}
            </h1>

            <p className="font-literary italic text-sm sm:text-base text-stone-300 max-w-xl mx-auto">
              {article.subtitle[language]}
            </p>

            <div className="text-xs font-classical text-amber-400/90 pt-2">
              {article.author} • {article.metadata?.originalEra || 'Classical Treatise'}
            </div>
          </div>

          {/* Philosophical Callout Quote */}
          {article.metadata?.philosophicalQuote && (
            <div className="my-6 p-6 rounded-2xl bg-amber-950/20 border border-amber-700/40 relative">
              <Quote className="w-8 h-8 text-amber-500/30 absolute top-4 left-4" />
              <blockquote className="text-center font-literary italic text-base sm:text-lg text-amber-200 px-6">
                «{article.metadata.philosophicalQuote}»
              </blockquote>
            </div>
          )}

          {/* Manuscript Body with Illuminated First Letter */}
          <div className={`prose prose-invert max-w-none text-stone-200 font-literary ${getFontSizeClass()} space-y-6`}>
            {article.fullContent[language].split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-classical text-xl sm:text-2xl font-bold text-amber-200 pt-6 border-b border-amber-900/40 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-4 border-amber-500 pl-6 py-3 my-6 italic text-amber-100 bg-amber-950/30 rounded-r">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 text-stone-300">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx}>{line.replace(/^[-*0-9.]+\s*/, '')}</li>
                    ))}
                  </ul>
                );
              }

              // First paragraph illuminated drop-cap effect
              if (idx === 0) {
                const firstLetter = paragraph.charAt(0);
                const rest = paragraph.slice(1);
                return (
                  <p key={idx} className="leading-relaxed">
                    <span className="float-left text-4xl sm:text-5xl font-classical text-amber-400 font-bold leading-none pr-3 pt-1">
                      {firstLetter}
                    </span>
                    {rest}
                  </p>
                );
              }

              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Classical References */}
          {article.sources && article.sources.length > 0 && (
            <div className="pt-8 border-t border-amber-900/40 text-xs font-literary">
              <h4 className="text-amber-400 uppercase tracking-wider text-[11px] mb-2 font-bold font-classical">
                {t('sourcesAndReferences')}
              </h4>
              <ul className="space-y-1 text-stone-400 text-[12px]">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-amber-500">¶</span>
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
