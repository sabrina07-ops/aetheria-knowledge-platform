import React from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  Calendar, 
  MapPin, 
  Award, 
  Quote, 
  BookOpen, 
  Compass, 
  ExternalLink,
  Sparkles,
  Check,
  Trash2,
  Edit
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { Article } from '../../../types';

interface BiographyDossierModalProps {
  article: Article;
  onClose: () => void;
}

export const BiographyDossierModal: React.FC<BiographyDossierModalProps> = ({ article, onClose }) => {
  const { language, toggleBookmark, user, token, refreshArticles, theme } = useApp();
  const [copied, setCopied] = React.useState(false);

  const isBookmarked = user?.savedArticles.includes(article.id);
  const meta = article.metadata;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟' : 'Are you sure you want to delete this biography?')) return;
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await refreshArticles();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div 
      id="biography-dossier-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="biography-dossier-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors duration-200 ${
          isDark 
            ? 'bg-slate-950 border-emerald-900/60 text-slate-100' 
            : 'bg-[#fcfbf9] border-emerald-200 text-stone-900 shadow-emerald-900/10'
        }`}
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />

        {/* Header Action Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-stone-200 bg-stone-100/70'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              {language === 'ar' ? 'سجل السيرة والترجمة التاريخية' : 'HISTORICAL BIOGRAPHY DOSSIER'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl transition cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                title={language === 'ar' ? 'حذف هذه السيرة' : 'Delete Biography'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                  : isDark 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                    : 'hover:bg-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title={isBookmarked ? 'Saved' : 'Save Biography'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                  : 'hover:bg-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                  : 'hover:bg-stone-200 text-stone-500 hover:text-stone-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scholar Banner & Identity */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500/40 shadow-xl">
              <img 
                src={article.coverImage} 
                alt={article.title[language]} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {meta?.lifespan && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-emerald-300' : 'bg-stone-100 border-stone-300 text-emerald-800'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{meta.lifespan}</span>
                  </span>
                )}

                {meta?.birthPlace && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-300 text-stone-700'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{meta.birthPlace[language]}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-classical leading-tight">
                {meta?.personName ? meta.personName[language] : article.title[language]}
              </h1>

              <p className="text-sm sm:text-base font-literary italic text-emerald-600 dark:text-emerald-400">
                {article.subtitle[language]}
              </p>

              {meta?.fieldOfImpact && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="font-semibold text-amber-500">{language === 'ar' ? 'ميادين الريادة:' : 'Fields of Mastery:'}</span>
                  <span className="text-stone-600 dark:text-slate-300">{meta.fieldOfImpact[language]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Prominent Scholar Quote */}
          {meta?.keyQuote && (
            <div className={`p-5 rounded-2xl border relative overflow-hidden ${
              isDark 
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' 
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              <Quote className="w-8 h-8 text-emerald-500/20 absolute -bottom-2 -left-2 rotate-180 pointer-events-none" />
              <p className="font-literary text-base sm:text-lg italic leading-relaxed text-center">
                «{meta.keyQuote[language]}»
              </p>
              <div className="text-center mt-2 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                — {meta?.personName ? meta.personName[language] : article.author}
              </div>
            </div>
          )}

          {/* Major Contributions & Breakthroughs */}
          {meta?.majorContributions && meta.majorContributions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{language === 'ar' ? 'المآثر الكبرى والآثار الخالدة' : 'Major Enduring Contributions'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meta.majorContributions.map((contrib, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                      isDark 
                        ? 'bg-slate-900/60 border-slate-800 text-slate-200' 
                        : 'bg-stone-100/80 border-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span>{contrib[language]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Biographical Treatise Markdown Content */}
          <div className={`pt-6 border-t ${isDark ? 'border-slate-800/80' : 'border-stone-200'}`}>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'سرد السيرة والتحليل التاريخي' : 'Biographical Monograph & Historic Analysis'}</span>
            </h3>

            <div className={`prose max-w-none text-sm sm:text-base leading-relaxed space-y-4 ${
              isDark 
                ? 'prose-invert prose-emerald text-slate-300' 
                : 'text-stone-800'
            }`}>
              <ReactMarkdown>
                {article.fullContent[language]}
              </ReactMarkdown>
            </div>
          </div>

          {/* Academic References & Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className={`p-4 rounded-xl border mt-6 text-xs ${
              isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-stone-100 border-stone-200 text-stone-600'
            }`}>
              <div className="font-mono font-semibold uppercase tracking-wider mb-2 text-stone-700 dark:text-slate-300">
                {language === 'ar' ? 'المراجع والمصادر التوثيقية:' : 'Academic & Historical Sources:'}
              </div>
              <ul className="list-disc list-inside space-y-1">
                {article.sources.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Close Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide transition cursor-pointer shadow-md"
            >
              {language === 'ar' ? 'إغلاق سجل السيرة' : 'Close Dossier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
