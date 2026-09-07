import React, { useState } from 'react';
import { 
  UserCheck, 
  Search,
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Quote,
  Award,
  Plus,
  Trash2,
  Edit,
  Globe,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BiographyDossierModal } from './science/BiographyDossierModal';
import { Article } from '../../types';

export const ScienceSection: React.FC = () => {
  const { articles, language, toggleBookmark, user, token, deleteArticle, theme, t, navigateTo } = useApp();
  const [activeEra, setActiveEra] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBioArticle, setActiveBioArticle] = useState<Article | null>(null);

  const isDark = theme === 'dark';

  // Strictly filter for Biographies & Luminaries
  const bioArticles = articles.filter(a => 
    a.category === 'science' || 
    a.metadata?.isBiography || 
    a.tags.some(tag => ['biographies', 'scholars', 'luminaries', 'biography'].includes(tag.toLowerCase()))
  );

  // Filter by Era
  const eraFiltered = bioArticles.filter(art => {
    if (activeEra === 'all') return true;
    const eraStr = (art.metadata?.historicalEra?.en || art.metadata?.historicalEra?.ar || art.tags.join(' ')).toLowerCase();
    if (activeEra === 'islamic') {
      return eraStr.includes('islamic') || eraStr.includes('ذهبي') || eraStr.includes('إسلامي') || eraStr.includes('alhazen') || eraStr.includes('avicenna') || eraStr.includes('sina') || eraStr.includes('haytham');
    }
    if (activeEra === 'modern') {
      return eraStr.includes('modern') || eraStr.includes('20th') || eraStr.includes('19th') || eraStr.includes('حديث') || eraStr.includes('curie') || eraStr.includes('tesla') || eraStr.includes('einstein');
    }
    if (activeEra === 'renaissance') {
      return eraStr.includes('renaissance') || eraStr.includes('نهضة') || eraStr.includes('تنوير') || eraStr.includes('newton') || eraStr.includes('da vinci');
    }
    return true;
  });

  // Filter by Search Query
  const finalArticles = eraFiltered.filter(art => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameEn = (art.metadata?.personName?.en || art.title.en).toLowerCase();
    const nameAr = (art.metadata?.personName?.ar || art.title.ar).toLowerCase();
    const fieldEn = (art.metadata?.fieldOfImpact?.en || '').toLowerCase();
    const fieldAr = (art.metadata?.fieldOfImpact?.ar || '').toLowerCase();
    const birthEn = (art.metadata?.birthPlace?.en || '').toLowerCase();
    const birthAr = (art.metadata?.birthPlace?.ar || '').toLowerCase();

    return nameEn.includes(q) || nameAr.includes(q) || fieldEn.includes(q) || fieldAr.includes(q) || birthEn.includes(q) || birthAr.includes(q);
  });

  const handleDeleteArticle = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه السيرة الذاتية من الأرشيف نهائياً؟' : 'Are you sure you want to delete this biography?')) return;
    try {
      await deleteArticle(articleId);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div 
      id="biographies-realm-view" 
      className={`min-h-screen transition-colors duration-200 relative pb-28 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#faf9f6] text-stone-900'
      }`}
    >
      {/* Pure Biographies & Luminaries Archive Hero */}
      <section className={`relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b overflow-hidden ${
        isDark ? 'border-emerald-900/40' : 'border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-transparent'
      }`}>
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`inline-flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full border ${
              isDark 
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400' 
                : 'bg-emerald-100/80 border-emerald-300 text-emerald-800'
            }`}>
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'ar' ? 'ديوان الأعلام وسير الخالدين // ARCHIVE OF GREAT MINDS' : 'ARCHIVE OF GREAT MINDS // BIOGRAPHICAL CHRONICLES'}</span>
            </div>

            {user?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? '+ إضافة سيرة ذاتية لشخصية جديدة' : '+ Add Luminary Biography'}</span>
              </button>
            )}
          </div>

          {/* Dedicated Biographies Title */}
          <h1 className={`font-classical text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
            isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-slate-200' 
              : 'text-stone-900'
          }`}>
            {language === 'ar' ? 'ديوان الأعلام والسير الذاتية' : 'Biographies & Luminaries Archive'}
          </h1>
          
          {/* Subtitle */}
          <p className={`font-literary text-base sm:text-xl max-w-3xl leading-relaxed italic ${
            isDark ? 'text-emerald-100/90' : 'text-emerald-950'
          }`}>
            {language === 'ar'
              ? '«سجلات توثق مسيرات وسير كبار العباقرة والعلماء والمفكرين والأدباء وصناع الحضارة الإنسانية عبر التاريخ»'
              : '"Living archives chronicling the enduring life journeys, struggles, and immortal intellectual legacies of humanity\'s greatest pioneers."'}
          </p>

          <p className={`text-xs sm:text-sm max-w-2xl font-light ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
            {language === 'ar'
              ? 'تصفح دراسات السير الذاتية لأعظم العقول، وتعرف على حيواتهم، مواطنهم، أقوالهم المأثورة، ومآثرهم التي غيرت مسار التاريخ الإنساني.'
              : 'Explore comprehensive biographical dossiers of humanity\'s most luminous minds, from golden-age polymaths to modern pioneers of physics and medicine.'}
          </p>

          {/* Search & Era Switcher */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-stone-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن علم، مفكر، موطن، أو مجال نفوذ...' : 'Search luminaries, scholars, origins, or fields...'}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition outline-none ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200 focus:border-emerald-500' 
                    : 'bg-white border-stone-300 text-stone-900 focus:border-emerald-600'
                }`}
              />
            </div>

            {/* Eras Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveEra('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeEra === 'all'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isDark 
                      ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800' 
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-sm'
                }`}
              >
                {language === 'ar' ? 'كافة الأعلام' : 'All Luminaries'} ({bioArticles.length})
              </button>

              <button
                onClick={() => setActiveEra('islamic')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                  activeEra === 'islamic'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isDark 
                      ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800' 
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-sm'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? 'العصر الذهبي الإسلامي' : 'Islamic Golden Age'}</span>
              </button>

              <button
                onClick={() => setActiveEra('modern')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                  activeEra === 'modern'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isDark 
                      ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800' 
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-sm'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'العصر الحديث والثورة العلمية' : 'Modern Era Pioneers'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Exclusively Biographies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {finalArticles.length === 0 ? (
          <div className="text-center py-20">
            <UserCheck className="w-12 h-12 mx-auto mb-3 text-emerald-500/40" />
            <h3 className="text-base font-semibold text-slate-400">
              {language === 'ar' ? 'لم يتم العثور على سير تطابق معايير البحث.' : 'No biographical dossiers match your inquiry.'}
            </h3>
            <button
              onClick={() => { setSearchQuery(''); setActiveEra('all'); }}
              className="mt-3 text-xs text-emerald-500 underline font-mono cursor-pointer"
            >
              {language === 'ar' ? 'إعادة تعيين البحث' : 'Reset search filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalArticles.map(art => {
              const isBookmarked = user?.savedArticles.includes(art.id);
              const meta = art.metadata;
              const personName = meta?.personName ? meta.personName[language] : art.title[language];

              return (
                <article
                  key={art.id}
                  id={`bio-card-${art.id}`}
                  onClick={() => setActiveBioArticle(art)}
                  className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-emerald-500/15 ${
                    isDark 
                      ? 'bg-slate-900/90 border-emerald-900/60 hover:border-emerald-500 ring-1 ring-emerald-500/10' 
                      : 'bg-white border-emerald-200 hover:border-emerald-500 ring-1 ring-emerald-500/10'
                  }`}
                >
                  {/* Luminary Portrait Cover */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={art.coverImage}
                      alt={personName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDark ? 'from-slate-900 via-slate-900/20 to-transparent' : 'from-black/75 via-black/20 to-transparent'
                    }`} />

                    {/* Biography Badge */}
                    <span className="absolute top-3 left-3 text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-md flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'ar' ? 'سيرة عَلَم' : 'BIOGRAPHY'}</span>
                    </span>

                    {/* Admin Delete & Edit Controls */}
                    {user?.role === 'admin' && (
                      <button
                        onClick={(e) => handleDeleteArticle(e, art.id)}
                        className="absolute top-3 right-12 p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 hover:text-white transition shadow-md"
                        title={language === 'ar' ? 'حذف هذه السيرة' : 'Delete Biography'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(art.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl transition shadow-md ${
                        isDark 
                          ? 'bg-slate-950/80 border border-emerald-500/30 text-emerald-300 hover:text-white' 
                          : 'bg-white/90 border border-stone-300 text-stone-700 hover:text-emerald-700'
                      }`}
                      title={isBookmarked ? t('bookmarkedArticle') : t('bookmarkArticle')}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                    </button>

                    {/* Lifespan & Homeland Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-200 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{meta?.lifespan || art.publicationDate}</span>
                      </div>
                      {meta?.birthPlace && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-300 shrink-0">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span className="truncate max-w-[120px]">{meta.birthPlace[language].split('—')[0].trim()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Field of Impact */}
                      {meta?.fieldOfImpact && (
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5 font-semibold">
                          <Award className="w-3 h-3 text-emerald-500" />
                          <span className="line-clamp-1">{meta.fieldOfImpact[language]}</span>
                        </div>
                      )}

                      {/* Person Title */}
                      <h3 className={`font-classical text-xl font-bold transition line-clamp-2 leading-snug ${
                        isDark 
                          ? 'text-slate-100 group-hover:text-emerald-300' 
                          : 'text-stone-900 group-hover:text-emerald-700'
                      }`}>
                        {personName}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm font-literary italic text-emerald-600 dark:text-emerald-400 line-clamp-1 mt-1">
                        {art.subtitle[language]}
                      </p>

                      {/* Short Description */}
                      <p className={`text-xs sm:text-sm line-clamp-3 mt-2 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-stone-600'
                      }`}>
                        {art.shortDescription[language]}
                      </p>

                      {/* Key Wisdom Quote Snippet */}
                      {meta?.keyQuote && (
                        <div className={`mt-3 p-2.5 rounded-xl border text-[11px] font-literary italic leading-relaxed line-clamp-2 ${
                          isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}>
                          «{meta.keyQuote[language]}»
                        </div>
                      )}
                    </div>

                    {/* Card Action Footer */}
                    <div className={`pt-4 border-t flex items-center justify-between text-xs font-mono font-semibold ${
                      isDark 
                        ? 'border-emerald-900/30 text-emerald-400' 
                        : 'border-stone-200 text-emerald-700'
                    }`}>
                      <span>
                        {language === 'ar' ? 'فتح سجل السيرة والترجمة' : 'OPEN SCHOLAR DOSSIER'}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Full Biography Dossier Modal */}
      {activeBioArticle && (
        <BiographyDossierModal 
          article={activeBioArticle} 
          onClose={() => setActiveBioArticle(null)} 
        />
      )}
    </div>
  );
};
