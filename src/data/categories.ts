import { CategoryInfo, CategoryKey } from '../types';

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  space: {
    key: 'space',
    name: {
      en: 'Space & Cosmos',
      ar: 'الفضاء والكون',
    },
    tagline: {
      en: 'Observatory of the Infinite Void & Stellar Wonders',
      ar: 'مرصد الفراغ اللانهائي وعجائب النجوم',
    },
    description: {
      en: 'Journey across deep-field astrophysics, exoplanets, stellar evolution, and cosmic expeditions.',
      ar: 'رحلة عبر الفيزياء الفلكية السحيقة، الكواكب الخارجية، وتطور النجوم والبعثات الكونية.',
    },
    atmosphereDescription: {
      en: 'Cosmic observatory with telemetry readouts, orbital coordinates, and nebula luminescence.',
      ar: 'مرصد كوني مجهز ببيانات القياس عن بُعد، الإحداثيات المدارية، وتوهج السدم.',
    },
    colorScheme: {
      accent: '#38bdf8', // sky/cyan
      border: 'rgba(56, 189, 248, 0.25)',
      glow: 'rgba(56, 189, 248, 0.15)',
      badgeBg: 'bg-sky-950/80',
      badgeText: 'text-sky-300',
    },
    icon: 'Orbit',
  },
  technology: {
    key: 'technology',
    name: {
      en: 'Technology & Digital World',
      ar: 'التكنولوجيا والعالم الرقمي',
    },
    tagline: {
      en: 'Frontiers of Artificial Intelligence, Quantum Frontiers & Digital Culture',
      ar: 'آفاق الذكاء الاصطناعي، الحوسبة الكمية، والثقافة الرقمية',
    },
    description: {
      en: 'Curated dispatches on paradigm shifts in computing, robotics, cybersecurity, historical inventions, and digital society.',
      ar: 'تقارير منتقاة عن التحولات الجذرية في الحوسبة، الروبوتات، الأمن السيبراني، والاختراعات التاريخية.',
    },
    atmosphereDescription: {
      en: 'Futuristic digital archive and cyber newsroom with terminal HUDs and system metrics.',
      ar: 'أرشيف رقمي مستقبلي وغرفة أخبار سيبرانية مع لوحات مؤشرات متطورة.',
    },
    colorScheme: {
      accent: '#06b6d4', // cyan/teal neon
      border: 'rgba(6, 182, 212, 0.3)',
      glow: 'rgba(6, 182, 212, 0.2)',
      badgeBg: 'bg-cyan-950/80',
      badgeText: 'text-cyan-300',
    },
    icon: 'Cpu',
  },
  art: {
    key: 'art',
    name: {
      en: 'Art & Visual Culture',
      ar: 'الفن والثقافة البصرية',
    },
    tagline: {
      en: 'The Grand Gallery of Human Aesthetics, Masters & Perspectives',
      ar: 'معرض الجماليات الإنسانية، كبار الفنانين والآفاق البصرية',
    },
    description: {
      en: 'Curated retrospectives on Renaissance geometry, Impressionist light, Eastern philosophy in craft, and modern movements.',
      ar: 'قراءات تأملية في هندسة عصر النهضة، ضوء الانطباعية، الفلسفة الشرقية في الحرف، والحركات الفنية الحديثة.',
    },
    atmosphereDescription: {
      en: 'Museum salon with gilded framing, archival curation notes, and golden ratio proportions.',
      ar: 'صالون متحفي بإطارات مذهبة، مذكرات تقييم أرشيفية، وتناسبات النسبة الذهبية.',
    },
    colorScheme: {
      accent: '#d97706', // amber/gilt gold
      border: 'rgba(217, 119, 6, 0.3)',
      glow: 'rgba(217, 119, 6, 0.15)',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-300',
    },
    icon: 'Palette',
  },
  literature: {
    key: 'literature',
    name: {
      en: 'Literature & Epics',
      ar: 'الأدب والملاحم',
    },
    tagline: {
      en: 'Chronicles of Immortal Manuscripts & The Written Word',
      ar: 'سجلات المخطوطات الخالدة والكلمة المكتوبة',
    },
    description: {
      en: 'Unearthing forgotten codices, classical epics, profound prose, and the lost treasures of antiquity.',
      ar: 'استكشاف المخطوطات القديمة، الملاحم الكلاسيكية، النثر العميق، وكنوز المكتبات المفقودة.',
    },
    atmosphereDescription: {
      en: 'Classical antique library with parchment paper texture, illuminated letters, and warm sepia tones.',
      ar: 'مكتبة كلاسيكية عريقة بملامح المخطوطات الورقية، والخطوط المحبرة، وتدرجات السيبيا الدافئة.',
    },
    colorScheme: {
      accent: '#b45309', // warm book leather/sepia
      border: 'rgba(180, 83, 9, 0.35)',
      glow: 'rgba(180, 83, 9, 0.15)',
      badgeBg: 'bg-stone-900',
      badgeText: 'text-amber-200',
    },
    icon: 'BookOpen',
  },
  philosophy: {
    key: 'philosophy',
    name: {
      en: 'Philosophy & Thought',
      ar: 'الفلسفة والفكر',
    },
    tagline: {
      en: 'Dialogues on Being, Morality, Existential Inquiry & Human Wisdom',
      ar: 'حوارات الوجود، الأخلاق، التساؤل الوجودي والحكمة الإنسانية',
    },
    description: {
      en: 'Deep dives into Stoicism, Existentialism, Islamic rationalism, Enlightenment ideals, and metaphysics.',
      ar: 'قراءات معمقة في الرواقية، الوجودية، العقلانية الإسلامية، فلسفة التنوير، وما وراء الطبيعة.',
    },
    atmosphereDescription: {
      en: 'Contemplative intellectual sanctuary with classical Roman stone motifs and philosophical dialectics.',
      ar: 'ملاذ فكري تأملي يتميز برصانة الحوارات الفلسفية وعمق التفكير الإنساني.',
    },
    colorScheme: {
      accent: '#8b5cf6', // amethyst / wisdom purple
      border: 'rgba(139, 92, 246, 0.3)',
      glow: 'rgba(139, 92, 246, 0.15)',
      badgeBg: 'bg-purple-950/80',
      badgeText: 'text-purple-300',
    },
    icon: 'Feather',
  },
  science: {
    key: 'science',
    name: {
      en: 'Biographies & Luminaries',
      ar: 'ديوان الأعلام والسير الذاتية',
    },
    tagline: {
      en: 'Chronicles of Immortal Minds, Trailblazers of Knowledge & Human Civilization',
      ar: 'سير الخالدين، وتراجم رواد الفكر والعلوم والاكتشاف وصناع الحضارة',
    },
    description: {
      en: 'Curated historical dossiers and biographical treatises tracing the lives, struggles, breakthroughs, and philosophical legacies of humanity’s greatest pioneers.',
      ar: 'دراسات توثيقية وتراجم وسير كبار المفكرين والعلماء والأدباء الذين شكلوا مسار الحضارة الإنسانية بآثارهم الخالدة.',
    },
    atmosphereDescription: {
      en: 'Prestigious classical archive with historical timelines, origins telemetry, and gilded luminary portraits.',
      ar: 'ديوان تراثي وأرشيف تاريخي رفيع يوثق مسيرة الأعلام بحقبهم ومحطات حياتهم ومآثرهم الخالدة.',
    },
    colorScheme: {
      accent: '#10b981', // emerald
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.15)',
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-300',
    },
    icon: 'UserCheck',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
