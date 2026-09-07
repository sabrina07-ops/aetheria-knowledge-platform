import React, { useState } from 'react';
import { Library, ExternalLink, Search, Filter, BookOpen, Orbit, Cpu, Palette, Atom } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RESOURCES_DATA } from '../../data/resources';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const ResourcesSection: React.FC = () => {
  const { language, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filtered = RESOURCES_DATA.filter(res => {
    const matchCat = selectedCat === 'all' || res.category === selectedCat;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      res.title.en.toLowerCase().includes(q) ||
      res.title.ar.toLowerCase().includes(q) ||
      res.description.en.toLowerCase().includes(q) ||
      res.description.ar.toLowerCase().includes(q) ||
      res.authorOrSource.toLowerCase().includes(q)
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
    <div id="resources-realm-view" className="min-h-screen bg-slate-950 text-slate-100 relative pb-24">
      {/* Hero */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-900/60 w-fit mb-4">
            <Library className="w-3.5 h-3.5" />
            <span>UNIVERSAL SCHOLARLY DIRECTORY & CORPORA</span>
          </div>

          <h1 className="font-classical text-3xl sm:text-5xl font-bold text-slate-100">
            {t('navResources')}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-3 leading-relaxed">
            {language === 'ar'
              ? 'ببليوغرافيا وأرشيفات رقمية منتقاة بعناية للباحثين والطلاب، تربطك بالمصادر الأولية في الفلك والفلسفة والتكنولوجيا والفن.'
              : 'A curated bibliography of primary research repositories, astrophysics registries, classical manuscripts, and open academic corpora.'}
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  selectedCat === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {t('allTags')}
              </button>
              {Object.values(CATEGORIES).map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCat(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    selectedCat === cat.key
                      ? 'bg-slate-100 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat.key)}
                  <span>{cat.name[language]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div
              key={res.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                    {getCategoryIcon(res.category)}
                    {CATEGORIES[res.category]?.name[language]}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                    {res.type.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition">
                  {res.title[language]}
                </h3>

                <p className="text-xs text-slate-400 font-mono mt-1">
                  {res.authorOrSource} • {res.type}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mt-3">
                  {res.description[language]}
                </p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 group-hover:text-amber-300 transition"
              >
                <span>VISIT ARCHIVE REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
