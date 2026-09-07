import React, { useState } from 'react';
import { X, Bookmark, Share2, Cpu, Check, Terminal, Zap, Shield, Layers, Radio } from 'lucide-react';
import { Article } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES } from '../../../data/categories';

interface CyberReaderProps {
  article: Article | null;
  onClose: () => void;
}

export const CyberReader: React.FC<CyberReaderProps> = ({ article, onClose }) => {
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
      id="cyber-reader-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="cyber-hud-terminal"
        className="w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-2xl text-slate-100 max-h-[90vh] overflow-y-auto flex flex-col relative cyber-grid shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Cyber Top HUD Header */}
        <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/30 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-cyber tracking-widest text-cyan-400">
              SYS_READOUT // {article.id.toUpperCase()}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500">
              [LATENCY: 12ms • ENCRYPTION: SHA-512]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                isBookmarked 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300'
              }`}
              title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs transition cursor-pointer"
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

        {/* Cover with cyber corner accents */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 border-b border-cyan-900/50">
          <img
            src={article.coverImage}
            alt={article.title[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Tech Stack Pills */}
          {article.metadata?.techStack && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {article.metadata.techStack.map((tech, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/40 text-cyan-300">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Impact Score HUD */}
          {article.metadata?.impactScore && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-emerald-500/50 text-[11px] font-mono text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>CIVILIZATIONAL IMPACT: {article.metadata.impactScore}/100</span>
            </div>
          )}
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                {CATEGORIES.technology.name[language]}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {article.readingTime} {t('readingTime')} • {article.publicationDate}
              </span>
            </div>

            <h1 className="font-cyber text-2xl sm:text-4xl font-bold text-slate-100 leading-tight">
              {article.title[language]}
            </h1>

            <p className="text-sm sm:text-base text-cyan-200/80 font-mono mt-2 leading-relaxed">
              {article.subtitle[language]}
            </p>

            <div className="text-xs text-slate-500 mt-2 font-mono">
              CURATOR // {article.author}
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert prose-cyan max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            {article.fullContent[language].split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-cyber font-bold text-cyan-300 pt-4 border-b border-cyan-900/40 pb-1.5 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>{paragraph.replace('### ', '')}</span>
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-2 border-cyan-400 pl-4 py-2 my-4 italic text-cyan-200 bg-cyan-950/30 rounded-r font-mono">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-300 font-mono text-xs">
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

          {/* Primary References & Patent Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className="pt-6 border-t border-cyan-900/50 text-xs">
              <h4 className="font-mono text-cyan-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>{t('sourcesAndReferences')}</span>
              </h4>
              <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-cyan-500">»</span>
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
