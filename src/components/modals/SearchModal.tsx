import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag, BookOpen, Orbit, Cpu, Palette, Atom } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, articles, language, openArticle, navigateTo, t } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [searchOpen]);

  // Global shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const filtered = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      article.title.en.toLowerCase().includes(q) ||
      article.title.ar.toLowerCase().includes(q) ||
      article.subtitle.en.toLowerCase().includes(q) ||
      article.subtitle.ar.toLowerCase().includes(q) ||
      article.shortDescription.en.toLowerCase().includes(q) ||
      article.shortDescription.ar.toLowerCase().includes(q) ||
      article.tags.some(tag => tag.toLowerCase().includes(q)) ||
      article.category.toLowerCase().includes(q)
    );
  });

  const getCategoryIcon = (cat: CategoryKey) => {
    switch (cat) {
      case 'space': return <Orbit className="w-3.5 h-3.5 text-sky-400" />;
      case 'technology': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'art': return <Palette className="w-3.5 h-3.5 text-amber-400" />;
      case 'science': return <Atom className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div 
      id="search-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setSearchOpen(false)}
    >
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b border-slate-800/80 bg-slate-900/50 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('allTags')}
          </button>
          {Object.values(CATEGORIES).map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {getCategoryIcon(cat.key)}
              <span>{cat.name[language]}</span>
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {t('noResultsFound')}
            </div>
          ) : (
            filtered.map(article => (
              <div
                key={article.id}
                onClick={() => {
                  setSearchOpen(false);
                  navigateTo(article.category);
                  openArticle(article);
                }}
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-start gap-3 group"
              >
                <img
                  src={article.coverImage}
                  alt={article.title[language]}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
                      {getCategoryIcon(article.category)}
                      {CATEGORIES[article.category]?.name[language]}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {article.readingTime} {t('readingTime')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition line-clamp-1">
                    {article.title[language]}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {article.shortDescription[language]}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0 mt-3" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
