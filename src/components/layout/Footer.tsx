import React from 'react';
import { Compass, Instagram, Feather, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  const { language, navigateTo, t, user } = useApp();

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand & Philosophy */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-classical text-lg font-bold text-slate-100 tracking-wider">
              {t('siteTitle')}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {language === 'ar'
              ? 'أرشيف معرفي مفتوح يوثق أسرار الفضاء، تطور الفكر الإنساني، روائع الفن الكلاسيكي، وطليعة التكنولوجيا الرقمية.'
              : 'An enduring universal archive documenting the mysteries of the cosmos, the evolution of philosophical thought, masterworks of visual art, and the frontiers of digital technology.'}
          </p>
          <div className="pt-2 text-xs italic text-amber-400/80 font-literary border-l-2 border-amber-500/40 pl-3">
            {language === 'ar'
              ? '«الماضي أشبه بالآتي من الماء بالماء» — عبد الرحمن بن خلدون'
              : '"The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself." — Carl Sagan'}
          </div>
        </div>

        {/* Col 2: Realms of Knowledge */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
            {language === 'ar' ? 'العوالم المعرفية' : 'Knowledge Realms'}
          </h4>
          <ul className="space-y-2 text-xs">
            {Object.values(CATEGORIES).map(cat => (
              <li key={cat.key}>
                <button
                  onClick={() => navigateTo(cat.key)}
                  className="hover:text-amber-300 transition text-left cursor-pointer"
                >
                  {cat.name[language]}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigateTo('resources')}
                className="hover:text-amber-300 transition text-left cursor-pointer"
              >
                {t('navResources')}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Social & Instagram Connection */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
            {t('instagramConnectionTitle')}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('instagramConnectionDesc')}
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-700/40 text-xs text-purple-200 hover:text-white hover:border-purple-500/60 transition group"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition" />
            <span>{t('followInstagram')}</span>
            <ArrowUpRight className="w-3 h-3 text-purple-400" />
          </a>
        </div>

        {/* Col 4: Platform & Curator Studio */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
            {language === 'ar' ? 'الأرشيف والتوثيق' : 'Scholarly Archive'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'نظام المقالات مبني بمعمارية قابلة للتوسع اللانهائي، مع دعم كامل للغتين العربية والإنجليزية والتصميم التفاعلي لكل بيئة معرفية.'
              : 'Scalable content architecture with dual bilingual support, decoupled presentation layers, and dedicated reading environments.'}
          </p>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium hover:bg-amber-900/40 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('navAdmin')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>
          © 2026 {t('siteTitle')} — {t('siteSubtitle')}.
        </span>
        <span className="flex items-center gap-1">
          {language === 'ar' ? 'صُنعت بحرفية وشغف بالمعرفة' : 'Crafted with reverence for universal inquiry'}
        </span>
      </div>
    </footer>
  );
};
