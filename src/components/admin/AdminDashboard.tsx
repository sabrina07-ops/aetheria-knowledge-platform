import React, { useState, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  BookOpen, 
  Download, 
  Upload, 
  Search, 
  Palette, 
  Wand2, 
  Image as ImageIcon,
  Clock,
  Layers,
  FileText,
  Camera,
  Crown,
  Link as LinkIcon,
  RefreshCw,
  X,
  Orbit,
  Cpu,
  Atom,
  Compass,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { Article, CategoryKey } from '../../types';

// Curated Unsplash Image Galleries per section for 1-click styling
const CATEGORY_IMAGE_PRESETS: Record<CategoryKey, string[]> = {
  space: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=80',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80',
  ],
  literature: [
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3dd48?auto=format&fit=crop&w=1400&q=80',
  ],
  philosophy: [
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3dd48?auto=format&fit=crop&w=1400&q=80',
  ],
  science: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80',
  ],
};

// Section Style Metadata
const SECTION_STYLE_PROFILES: Record<CategoryKey, {
  nameAr: string;
  nameEn: string;
  aesthetic: string;
  primaryColor: string;
  badge: string;
}> = {
  space: {
    nameAr: 'الفضاء والكونيات',
    nameEn: 'Cosmology & Deep Space',
    aesthetic: 'خلفية مدارية عميقة، مقاييس تليمتري مرئية، خطوط فضائية، وتأثير النجوم المتلألئة',
    primaryColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40',
    badge: '🚀 COSMIC TELEMETRY HUD',
  },
  technology: {
    nameAr: 'التكنولوجيا والمستقبل',
    nameEn: 'Frontier Technology',
    aesthetic: 'تصميم سيبراني، واجهات نيون سيان، بطاقات برمجية تفاعلية، وخطوط أحادية العرض (Monospace)',
    primaryColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    badge: '⚡ CYBER-TERMINAL QUANTUM',
  },
  art: {
    nameAr: 'الفنون التشكيلية والمعارض',
    nameEn: 'Fine Art & Museum Gallery',
    aesthetic: 'إطارات متاحف مذهبة، بطاقات وصف فني أرستقراطية، تأثيرات إضاءة المعارض، وخطوط كلاسيكية فخمة',
    primaryColor: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
    badge: '🏛️ MUSEUM CURATORIAL PLAQUE',
  },
  literature: {
    nameAr: 'الأدب والفلسفة الكلاسيكية',
    nameEn: 'Literature & Philosophy',
    aesthetic: 'مخطوطة كلاسيكية نادرة، حواشي نقدية، حروف استهلالية مزخرفة، ونمط قراءة تأملي مريح',
    primaryColor: 'text-orange-300 border-orange-500/40 bg-orange-950/40',
    badge: '📜 CLASSICAL MONOGRAPH',
  },
  philosophy: {
    nameAr: 'الأدب والفلسفة الكلاسيكية',
    nameEn: 'Literature & Philosophy',
    aesthetic: 'مخطوطة كلاسيكية نادرة، حواشي نقدية، حروف استهلالية مزخرفة، ونمط قراءة تأملي مريح',
    primaryColor: 'text-orange-300 border-orange-500/40 bg-orange-950/40',
    badge: '📜 CLASSICAL MONOGRAPH',
  },
  science: {
    nameAr: 'ديوان الأعلام والسير الذاتية',
    nameEn: 'Biographies & Luminaries',
    aesthetic: 'سجل سيرة تاريخي مهيب، خاتم شرف مذهب، خط زمني للمحطات الحياتية، مآثر وأقوال مأثورة',
    primaryColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    badge: '✨ SCHOLAR BIOGRAPHY DOSSIER',
  },
};

export const AdminDashboard: React.FC = () => {
  const { user, token, articles, refreshArticles, language, openArticle, saveArticle, deleteArticle, exportDatabase, t } = useApp();

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form fields
  const [id, setId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [category, setCategory] = useState<CategoryKey>('science');
  const [tags, setTags] = useState('Biographies, History, Scholars');
  const [coverImage, setCoverImage] = useState(CATEGORY_IMAGE_PRESETS.science[0]);
  const [author, setAuthor] = useState('Chief Curator');
  const [readingTime, setReadingTime] = useState(6);
  const [shortDescEn, setShortDescEn] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [fullContentEn, setFullContentEn] = useState('');
  const [fullContentAr, setFullContentAr] = useState('');
  const [featured, setFeatured] = useState(false);

  // Biography Specific Fields
  const [isBiography, setIsBiography] = useState(true);
  const [personNameEn, setPersonNameEn] = useState('');
  const [personNameAr, setPersonNameAr] = useState('');
  const [lifespan, setLifespan] = useState('');
  const [birthPlaceEn, setBirthPlaceEn] = useState('');
  const [birthPlaceAr, setBirthPlaceAr] = useState('');
  const [fieldOfImpactEn, setFieldOfImpactEn] = useState('');
  const [fieldOfImpactAr, setFieldOfImpactAr] = useState('');
  const [keyQuoteEn, setKeyQuoteEn] = useState('');
  const [keyQuoteAr, setKeyQuoteAr] = useState('');
  const [contributionsInput, setContributionsInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Direct Device Image Uploading State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageTab, setImageTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Check if current logged-in admin is the owner (Sabrina Rahmani)
  const isOwner = user?.email?.toLowerCase() === 'sabrinarahmani920@gmail.com';

  // Client-side image resizing and optimization for smooth mobile & server storage
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error(language === 'ar' ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, GIF)' : 'Please choose a valid image'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(e.target?.result as string);
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => reject(new Error(language === 'ar' ? 'تعذر معالجة الصورة المرفوعة' : 'Failed to process image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error(language === 'ar' ? 'تعذر قراءة ملف الصورة' : 'Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadingImage(true);
    setStatusMsg(null);
    try {
      const dataUrl = await processImageFile(file);
      setCoverImage(dataUrl);
      setStatusMsg({
        type: 'success',
        message: language === 'ar' ? `تم رفع وتنسيق صورة "${file.name}" بنجاح!` : `Image "${file.name}" uploaded successfully!`,
      });
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err.message || 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Automatically calculate estimated reading time based on word count
  const handleContentChange = (enText: string, arText: string) => {
    setFullContentEn(enText);
    setFullContentAr(arText);
    const wordsEn = enText.trim().split(/\s+/).filter(Boolean).length;
    const wordsAr = arText.trim().split(/\s+/).filter(Boolean).length;
    const totalWords = Math.max(wordsEn, wordsAr);
    const calculatedMinutes = Math.max(1, Math.ceil(totalWords / 180));
    setReadingTime(calculatedMinutes);
  };

  // Change category handler: auto-sync image and biography toggle
  const handleCategoryChange = (newCat: CategoryKey) => {
    setCategory(newCat);
    // If user hasn't uploaded a custom photo, update preset
    if (!coverImage.startsWith('data:')) {
      setCoverImage(CATEGORY_IMAGE_PRESETS[newCat][0]);
    }
    if (newCat === 'science') {
      setIsBiography(true);
      setTags('Biographies, Scholars, Luminaries');
    } else {
      setIsBiography(false);
      setTags(`${newCat.toUpperCase()}, Insights, Analysis`);
    }
  };

  // Load a section content template automatically so user just writes text
  const loadSectionTemplate = () => {
    if (category === 'science' || isBiography) {
      setTitleEn('Ibn al-Nafis: Pioneer of the Pulmonary Circulation');
      setTitleAr('ابن النفيس: مكتشف الدورة الدموية الصغرى ورائد الطب التجريبي');
      setSubtitleEn('The 13th-century physician who revolutionized physiology and corrected Galenic dogma');
      setSubtitleAr('الطبيب الفيلسوف الذي صحح أخطاء جالينوس ووضع حجر الأساس لفيزيولوجيا القلب');
      setPersonNameEn('Ala al-Din Abu al-Hasan Ali ibn Abi al-Hazm al-Qarshi (Ibn al-Nafis)');
      setPersonNameAr('علاء الدين أبو الحسن علي بن أبي الحزم القرشي الدمشقي (ابن النفيس)');
      setLifespan('1213 – 1288 CE (607 – 687 AH)');
      setBirthPlaceEn('Damascus, Syria — Cairo, Egypt');
      setBirthPlaceAr('دمشق (سوريا) — القاهرة (مصر)');
      setFieldOfImpactEn('Medicine, Cardiology, Anatomy, Philosophy');
      setFieldOfImpactAr('الطب، تشريح القلب، الفيزيولوجيا، الفلسفة');
      setKeyQuoteEn('If I did not know that my books would last after me for ten thousand years, I would not have written them.');
      setKeyQuoteAr('لو لم أعلم أن كتبي تبقى بعدي عشرة آلاف سنة ما وضعتها.');
      setContributionsInput(
        `Discovery of pulmonary circulation | اكتشاف الدورة الدموية الصغرى وتوضيح جريان الدم عبر الرئتين\nAuthor of Sharh Tashrih al-Qanun | تأليف كتاب "شرح تشريح القانون" وتصحيح مفاهيم ابن سينا وجالينوس\nAl-Shamil fi al-Sina'a al-Tibbiyya | موسوعة "الشامل في الصناعة الطبية" المكونة من عشرات المجلدات`
      );
      setShortDescEn('Ibn al-Nafis was an Arab polymath who was the first to describe the pulmonary circulation of the blood, pre-dating Western anatomical discoveries by three centuries.');
      setShortDescAr('طبيب دمشقي وعالم موسوعي يعد أول من وصف بدقة الدورة الدموية الصغرى في الرئتين، متفوقاً على الأبحاث التشريحية الأوروبية بثلاثة قرون كاملة.');
      setFullContentEn(
`### The Awakening of a Scientific Mind in Damascus
Born near Damascus in 1213, Ibn al-Nafis studied medicine at the famous Bimaristan al-Nuri. His intellectual prowess quickly elevated him to the position of chief physician at the Al-Nasiri Hospital in Cairo.

### The Breakthrough: Overturning Centuries of Anatomical Dogma
For over a millennium, medical theory was dominated by Galen, who asserted that blood passed through invisible pores in the interventricular septum of the heart.

Ibn al-Nafis made a bold, observation-backed declaration:
> "The blood from the right chamber of the heart must arrive at the left chamber, but there is no direct pathway between them. The thick septum of the heart is not perforated... Instead, the blood passes through the pulmonary artery to the lungs, permeates its substance, mixes with air, and is then carried back to the left chamber through the pulmonary vein."

### Enduring Legacy
His manuscripts remained the vanguard of cardiovascular anatomy, bridging ancient Greek philosophy with empirical observational science.`
      );
      setFullContentAr(
`### النشأة والتكوين في بلاد الشام
ولد علاء الدين بن النفيس في ريف دمشق عام 607 هـ (1213 م)، وتتلمذ في البيمارستان النوري الكبير على يد كبار أطباء عصره، جامعاً بين علم الطب، والفلسفة، وأصول الفقه، والمنطق.

### الكشف المدوّي: نسف نظريات جالينوس وابن سينا
كان الاعتقاد الطبي السائد منذ أيام الإغريق أن الدم يتسرب مباشرة بين بطيني القلب عبر مسام غير مرئية في الحاجز العضلي. أعلن ابن النفيس برهانه التشريحي الحاسم:
> "إن الدم ينفذ من البطين الأيمن إلى الرئة عبر الشريان الوريدي، فيخالط الهواء، ويتصفى، ثم يعود إلى البطين الأيسر عبر الوريد الشرياني... وليس بين البطينين منفذ البتة، بل جِرم القلب هناك مصمت لا خرق فيه."

### الأثر الخالد في تاريخ الطب الإنساني
مهد هذا الكشف العبقري الطريق لرواد عصر النهضة، ويظل ابن النفيس نموذجاً للفكر العلمي المستقل الذي لا يسلّم للتقليد إلا بما يشهد له الدليل والبرهان الحسي.`
      );
      setReadingTime(5);
    } else {
      // Space or Tech or Art template
      setTitleEn(`Modern Perspectives in ${category.toUpperCase()}`);
      setTitleAr(`رؤى معاصرة في ${CATEGORIES[category]?.name.ar}`);
      setSubtitleEn(`An analytical investigation into the core principles of ${category}`);
      setSubtitleAr(`دراسة تحليلية معمقة في أحدث مستجدات وآفاق هذا الحقل المعرفي`);
      setShortDescEn(`This comprehensive overview examines the trajectory, breakthroughs, and philosophical implications of ${category}.`);
      setShortDescAr(`تستعرض هذه الدراسة الشاملة المنعطفات الكبرى، والأبعاد المعرفية، والتأثير الإنساني لهذا المجال.`);
      setFullContentEn(`### Foundational Paradigm\nEvery major transformation in ${category} begins with a fundamental re-examination of first principles.\n\n> The future belongs to those who observe with rigorous curiosity.\n\n### Core Breakthroughs\n1. Enhanced precision and systemic modeling\n2. Convergence with adjacent disciplines\n3. Long-term societal impact\n\n### Conclusion\nThe path forward requires both rigorous discipline and creative audacity.`);
      setFullContentAr(`### المنطلق الفكري التأسيسي\nيبدأ كل تحول جذري في هذا المضمار من إعادة مساءلة المبادئ الأولى واستكشاف الآفاق غير المطروقة.\n\n> إن المستقبل ملكٌ للعقول التي تجمع بين دقة الملاحظة وشجاعة الاستكشاف.\n\n### المحاور الجوهرية\n1. تعزيز الدقة والنمذجة المنهجية الشاملة\n2. التكامل بين التخصصات المعرفية المتجاورة\n3. الأثر المجتمعي والحضاري بعيد المدى\n\n### خاتمة واستشراف\nإن المضي قدماً يستوجب انضباطاً فكرياً مقروناً بجرأة إبداعية خلاقة.`);
      setReadingTime(4);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          {language === 'ar' ? 'منطقة المشرفين والمحررين محمية' : 'Curator Access Restricted'}
        </h2>
        <p className="text-sm text-slate-400">
          {language === 'ar'
            ? 'يتطلب الوصول إلى استوديو النشر تسجيل الدخول بحساب المشرف المعتمد ذو الصلاحيات الإدارية.'
            : 'Access to the Curator Studio requires verified administrator privileges.'}
        </p>
      </div>
    );
  }

  const resetForm = () => {
    setEditingArticleId(null);
    setId('');
    setTitleEn('');
    setTitleAr('');
    setSubtitleEn('');
    setSubtitleAr('');
    setCategory('science');
    setTags('Biographies, Scholars');
    setCoverImage(CATEGORY_IMAGE_PRESETS.science[0]);
    setAuthor(user.username || 'Chief Curator');
    setReadingTime(5);
    setShortDescEn('');
    setShortDescAr('');
    setFullContentEn('');
    setFullContentAr('');
    setFeatured(false);

    setIsBiography(true);
    setPersonNameEn('');
    setPersonNameAr('');
    setLifespan('');
    setBirthPlaceEn('');
    setBirthPlaceAr('');
    setFieldOfImpactEn('');
    setFieldOfImpactAr('');
    setKeyQuoteEn('');
    setKeyQuoteAr('');
    setContributionsInput('');

    setFormOpen(false);
  };

  const handleEditClick = (art: Article) => {
    setEditingArticleId(art.id);
    setId(art.id);
    setTitleEn(art.title.en);
    setTitleAr(art.title.ar);
    setSubtitleEn(art.subtitle.en);
    setSubtitleAr(art.subtitle.ar);
    setCategory(art.category);
    setTags(art.tags.join(', '));
    setCoverImage(art.coverImage);
    setAuthor(art.author);
    setReadingTime(art.readingTime);
    setShortDescEn(art.shortDescription.en);
    setShortDescAr(art.shortDescription.ar);
    setFullContentEn(art.fullContent.en);
    setFullContentAr(art.fullContent.ar);
    setFeatured(!!art.featured);

    const meta = art.metadata;
    const isBio = !!meta?.isBiography || art.tags.includes('Biographies') || art.category === 'science';
    setIsBiography(isBio);
    setPersonNameEn(meta?.personName?.en || '');
    setPersonNameAr(meta?.personName?.ar || '');
    setLifespan(meta?.lifespan || '');
    setBirthPlaceEn(meta?.birthPlace?.en || '');
    setBirthPlaceAr(meta?.birthPlace?.ar || '');
    setFieldOfImpactEn(meta?.fieldOfImpact?.en || '');
    setFieldOfImpactAr(meta?.fieldOfImpact?.ar || '');
    setKeyQuoteEn(meta?.keyQuote?.en || '');
    setKeyQuoteAr(meta?.keyQuote?.ar || '');
    if (meta?.majorContributions && meta.majorContributions.length > 0) {
      setContributionsInput(meta.majorContributions.map(c => `${c.en} | ${c.ar}`).join('\n'));
    } else {
      setContributionsInput('');
    }

    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (articleId: string) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الدراسة نهائياً؟' : t('confirmDelete'))) return;
    try {
      const res = await deleteArticle(articleId);
      if (res.success) {
        setStatusMsg({ type: 'success', message: language === 'ar' ? 'تم حذف المقالة بنجاح من الأرشيف.' : 'Treatise removed from archive.' });
      } else {
        setStatusMsg({ type: 'error', message: res.error || 'Failed to delete article.' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', message: 'Failed to delete article.' });
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aetheria_archive_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', message: language === 'ar' ? 'تم تصدير نسخة الأرشيف الاحتياطية بنجاح.' : 'Archive backup exported successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Failed to export backup' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const majorContributions = contributionsInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split('|').map(s => s.trim());
        return { en: parts[0] || '', ar: parts[1] || parts[0] || '' };
      });

    const isBioFinal = isBiography || category === 'science';

    const metadataPayload: any = isBioFinal ? {
      isBiography: true,
      personName: { en: personNameEn || titleEn, ar: personNameAr || titleAr },
      lifespan: lifespan || undefined,
      birthPlace: (birthPlaceEn || birthPlaceAr) ? { en: birthPlaceEn, ar: birthPlaceAr } : undefined,
      fieldOfImpact: (fieldOfImpactEn || fieldOfImpactAr) ? { en: fieldOfImpactEn, ar: fieldOfImpactAr } : undefined,
      keyQuote: (keyQuoteEn || keyQuoteAr) ? { en: keyQuoteEn, ar: keyQuoteAr } : undefined,
      majorContributions: majorContributions.length > 0 ? majorContributions : undefined,
    } : {};

    const payload: Partial<Article> = {
      id: editingArticleId || (id ? id : undefined),
      title: { en: titleEn, ar: titleAr },
      subtitle: { en: subtitleEn, ar: subtitleAr },
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage,
      author,
      readingTime: Number(readingTime) || 5,
      shortDescription: { en: shortDescEn, ar: shortDescAr },
      fullContent: { en: fullContentEn, ar: fullContentAr },
      featured,
      metadata: metadataPayload,
    };

    try {
      const res = await saveArticle(payload);
      if (!res.success) {
        setStatusMsg({ type: 'error', message: res.error || 'Failed to save treatise' });
      } else {
        setStatusMsg({
          type: 'success',
          message: editingArticleId
            ? (language === 'ar' ? 'تم تحديث الدراسة بنجاح.' : 'Treatise successfully updated.')
            : (language === 'ar' ? 'تم حفظ ونشر المقالة وتطبيق النمط الخاص بالقسم مباشرة!' : 'Article published with section-specific auto-styling!'),
        });
        resetForm();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err.message || 'Error occurred while saving.' });
    } finally {
      setLoading(false);
    }
  };

  // Filter articles in management table
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesCategory = filterCategory === 'all' || art.category === filterCategory;
      if (!matchesCategory) return false;
      if (!searchTableQuery.trim()) return true;
      const q = searchTableQuery.toLowerCase();
      return (
        art.title.en.toLowerCase().includes(q) ||
        art.title.ar.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [articles, filterCategory, searchTableQuery]);

  const activeProfile = SECTION_STYLE_PROFILES[category] || SECTION_STYLE_PROFILES.science;

  return (
    <div id="admin-studio-view" className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Studio Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="font-classical text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide">
              {language === 'ar' ? 'استوديو النشر والإدارة الاحترافي' : 'Curator Studio & Archival CMS'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'ar'
              ? 'أضف أو عدّل أو احذف المقالات، وارفع صورك الخاصة، واختر القسم المستهدف مباشرة مع حفظ دائم وتام لبياناتك.'
              : 'Add, modify, and publish treatises, upload your own photos, and choose target sections with persistent state.'}
          </p>
          {isOwner && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-xs">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'ar' 
                  ? 'مرحباً بكِ أستاذة صابرين رحماني (مالكة الموقع والمديرة العامة) — لديكِ كامل الصلاحيات لإدارة المحتوى والأقسام' 
                  : 'Welcome Sabrina Rahmani (Platform Owner & Chief Administrator) — Full Root Access Active'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title="Download JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'نسخة احتياطية' : 'Export DB'}</span>
          </button>

          <button
            onClick={() => {
              if (formOpen) resetForm();
              else {
                resetForm();
                setFormOpen(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{formOpen ? t('cancel') : (language === 'ar' ? '+ إضافة مقال / سيرة جديدة' : t('createArticle'))}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`mt-6 p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
          statusMsg.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            : 'bg-red-950/60 border-red-800 text-red-300'
        }`}>
          {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.message}</span>
        </div>
      )}

      {/* Editor Form Modal/Section */}
      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Top Form Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 absolute top-0 left-0 right-0" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 pt-2">
            <div>
              <h3 className="font-classical text-xl font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{editingArticleId ? (language === 'ar' ? 'تعديل المقالة / السيرة' : t('editArticle')) : (language === 'ar' ? 'إنشاء مقال / سيرة ذاتية جديدة' : t('createArticle'))}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'اختر القسم، وسيقوم النظام بتنسيق الألوان والخطوط وعرض البطاقات وفق هوية القسم البصرية تلقائياً.'
                  : 'Select a section and the system will automatically format typography, layout, and visual aura.'}
              </p>
            </div>

            {/* Quick Template Loader */}
            <button
              type="button"
              onClick={loadSectionTemplate}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? '⚡ تحميل قالب جاهز لهذا القسم' : '⚡ Load Section Template'}</span>
            </button>
          </div>

          {/* Section Selector Grid (Choosing the Realm / Part of the Site) */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {language === 'ar' ? 'اختر القسم المستهدف للمقال في الموقع:' : 'Target Archive Section:'}
                </h4>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 ${activeProfile.primaryColor}`}>
                <Palette className="w-3 h-3" />
                <span>{activeProfile.badge}</span>
              </div>
            </div>

            {/* 6 Visual Interactive Section Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { key: 'space', icon: Orbit, nameAr: 'الفضاء والكونيات', nameEn: 'Space', color: 'hover:border-indigo-500/60 text-indigo-400' },
                { key: 'technology', icon: Cpu, nameAr: 'التكنولوجيا', nameEn: 'Technology', color: 'hover:border-cyan-500/60 text-cyan-400' },
                { key: 'literature', icon: BookOpen, nameAr: 'الأدب واللغويات', nameEn: 'Literature', color: 'hover:border-orange-500/60 text-orange-400' },
                { key: 'philosophy', icon: Compass, nameAr: 'الفلسفة والأفكار', nameEn: 'Philosophy', color: 'hover:border-amber-500/60 text-amber-400' },
                { key: 'art', icon: Palette, nameAr: 'الفنون والمعارض', nameEn: 'Visual Arts', color: 'hover:border-rose-500/60 text-rose-400' },
                { key: 'science', icon: Atom, nameAr: 'الأعلام والسير', nameEn: 'Biographies', color: 'hover:border-emerald-500/60 text-emerald-400' },
              ].map(item => {
                const isSelected = category === item.key;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleCategoryChange(item.key as CategoryKey)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col items-center sm:items-start gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 ' + item.color
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-amber-400' : ''}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.key}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong className="text-slate-300 font-medium">
                  {language === 'ar' ? 'الهوية التلقائية للقسم:' : 'Adaptive Section Aura:'}
                </strong>{' '}
                {activeProfile.aesthetic}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Presentation */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">English Treatise Content</h4>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('titleEn')}</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={e => {
                    setTitleEn(e.target.value);
                    if (!id && !editingArticleId) {
                      setId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Al-Farabi and the Second Teacher Tradition"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('subtitleEn')}</label>
                <input
                  type="text"
                  value={subtitleEn}
                  onChange={e => setSubtitleEn(e.target.value)}
                  placeholder="e.g. Political philosophy and the harmonious city"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('shortDescEn')}</label>
                <textarea
                  rows={3}
                  value={shortDescEn}
                  onChange={e => setShortDescEn(e.target.value)}
                  placeholder="Concise overview appearing on index cards and previews..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('fullContentEn')}</label>
                <textarea
                  rows={8}
                  required
                  value={fullContentEn}
                  onChange={e => handleContentChange(e.target.value, fullContentAr)}
                  placeholder="Full text supporting Markdown headings (###), quotes (>), and bullet points..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Arabic Presentation */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800" dir="rtl">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">محتوى الدراسة باللغة العربية</h4>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('titleAr')}</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={e => setTitleAr(e.target.value)}
                  placeholder="مثال: الفارابي والمعلم الثاني في تاريخ الفلسفة"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('subtitleAr')}</label>
                <input
                  type="text"
                  value={subtitleAr}
                  onChange={e => setSubtitleAr(e.target.value)}
                  placeholder="مثال: الفلسفة السياسية ونظرية المدينة الفاضلة والاتصال بالعقل الفعال"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('shortDescAr')}</label>
                <textarea
                  rows={3}
                  value={shortDescAr}
                  onChange={e => setShortDescAr(e.target.value)}
                  placeholder="ملخص ومقدمة تظهر في بطاقات المعاينة وقائمة المقالات..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('fullContentAr')}</label>
                <textarea
                  rows={8}
                  required
                  value={fullContentAr}
                  onChange={e => handleContentChange(fullContentEn, e.target.value)}
                  placeholder="النص الكامل بالماركداون مع العناوين الفرعية (###) والاقتباسات (>)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Metadata Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('tagsLabel')}</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Biographies, Science, History"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('readingTimeLabel')} ({language === 'ar' ? 'دقيقة - تلقائي' : 'min - auto'})</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={readingTime}
                onChange={e => setReadingTime(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Advanced Cover Image Controller (Upload from device, Presets, URL) */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-bold text-slate-200">
                    {language === 'ar' ? 'صورة غلاف المقال (تحميل من جهازك أو اختيار جاهز):' : 'Article Cover Image:'}
                  </label>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      imageTab === 'upload'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'رفع من جهازي' : 'Device Upload'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      imageTab === 'presets'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'صور القسم' : 'Section Presets'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      imageTab === 'url'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'رابط مباشر' : 'External URL'}</span>
                  </button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleImageFileChange(e.target.files)}
              />

              {/* TAB 1: DEVICE UPLOAD (Drag & Drop / File Picker) */}
              {imageTab === 'upload' && (
                <div className="space-y-3">
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setDragActive(false);
                      handleImageFileChange(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                      dragActive
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      {uploadingImage ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        {uploadingImage
                          ? (language === 'ar' ? 'جاري معالجة وضغط الصورة...' : 'Processing image...')
                          : (language === 'ar' ? 'اضغط لاختيار صورة من هاتفك أو حاسوبك، أو اسحبها هنا' : 'Click to select from phone/computer, or drag here')}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {language === 'ar'
                          ? 'يدعم جميع الصيغ (JPG, PNG, WEBP, GIF). يتم تعديل الحجم تلقائياً لتوافق مثالي مع الجوال.'
                          : 'Supports JPG, PNG, WEBP, GIF. Automatically optimized for lightning fast loading.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      className="mt-1 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                    >
                      {language === 'ar' ? 'تصفح الملفات' : 'Browse Device Files'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESETS */}
              {imageTab === 'presets' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 block">
                    {language === 'ar' ? 'صور أرشيفية منتقاة بدقة عالية تناسب هذا القسم:' : 'Curated high-resolution covers for this section:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CATEGORY_IMAGE_PRESETS[category]?.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(url)}
                        className={`relative h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer group ${
                          coverImage === url ? 'border-amber-400 scale-[1.02] ring-1 ring-amber-400' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="preset" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        {coverImage === url && (
                          <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                            <div className="p-1 rounded-full bg-amber-400 text-slate-950 font-bold">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT URL */}
              {imageTab === 'url' && (
                <div>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {language === 'ar' ? 'يمكنك وضع أي رابط مباشر لصورة من الإنترنت.' : 'You can paste any direct web image link here.'}
                  </p>
                </div>
              )}

              {/* CURRENT ACTIVE COVER PREVIEW */}
              {coverImage && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 mt-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={coverImage}
                      alt="Active cover"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">
                          {language === 'ar' ? 'الغلاف المختار حالياً' : 'Active Cover Image'}
                        </span>
                        {coverImage.startsWith('data:') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-400 font-semibold">
                            {language === 'ar' ? 'صورة من جهازك' : 'Device Upload'}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
                        {coverImage.startsWith('data:') ? 'مخزنة كصورة مدمجة عالية الجودة' : coverImage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                      title={language === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage(CATEGORY_IMAGE_PRESETS[category][0])}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs transition cursor-pointer"
                      title={language === 'ar' ? 'استعادة الافتراضي' : 'Reset to default'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Biography Dossier Fields Section (Exclusively highlighted for science category) */}
          {(category === 'science' || isBiography) && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-emerald-300">
                    {language === 'ar' ? 'سجل السيرة التاريخية للأعلام والمفكرين' : 'HISTORICAL BIOGRAPHY DOSSIER METADATA'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {language === 'ar' ? 'يُطبق تلقائياً على صفحة ديوان الأعلام' : 'Auto-renders into luminary dossier modal'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'سنوات العمر والوفاة' : 'Lifespan (e.g. 965 – 1040 CE)'}
                  </label>
                  <input
                    type="text"
                    value={lifespan}
                    onChange={e => setLifespan(e.target.value)}
                    placeholder="965 – 1040 م (354 – 430 هـ)"
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'الموطن والنشأة (En)' : 'Birthplace & Origins (En)'}
                  </label>
                  <input
                    type="text"
                    value={birthPlaceEn}
                    onChange={e => setBirthPlaceEn(e.target.value)}
                    placeholder="Basra, Iraq — Cairo, Egypt"
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div dir="rtl">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'الموطن والنشأة (عربي)' : 'Birthplace & Origins (Ar)'}
                  </label>
                  <input
                    type="text"
                    value={birthPlaceAr}
                    onChange={e => setBirthPlaceAr(e.target.value)}
                    placeholder="البصرة (العراق) — القاهرة (مصر)"
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'ميادين الريادة (En)' : 'Fields of Impact (En)'}
                  </label>
                  <input
                    type="text"
                    value={fieldOfImpactEn}
                    onChange={e => setFieldOfImpactEn(e.target.value)}
                    placeholder="Optics, Experimental Physics, Astronomy"
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div dir="rtl">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'ميادين الريادة (عربي)' : 'Fields of Impact (Ar)'}
                  </label>
                  <input
                    type="text"
                    value={fieldOfImpactAr}
                    onChange={e => setFieldOfImpactAr(e.target.value)}
                    placeholder="علم البصريات، الفيزياء التجريبية، الفلك"
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'مقولة مأثورة (En)' : 'Celebrated Quote (En)'}
                  </label>
                  <input
                    type="text"
                    value={keyQuoteEn}
                    onChange={e => setKeyQuoteEn(e.target.value)}
                    placeholder="The seeker after truth questions what he gathers..."
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div dir="rtl">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'مقولة مأثورة (عربي)' : 'Celebrated Quote (Ar)'}
                  </label>
                  <input
                    type="text"
                    value={keyQuoteAr}
                    onChange={e => setKeyQuoteAr(e.target.value)}
                    placeholder="طالب الحق يتهم ظنه في الأقدمين ويتبع البرهان..."
                    className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  {language === 'ar' ? 'المآثر والإنجازات الكبرى (سطر لكل إنجاز، بالصيغة: English | Arabic)' : 'Major Enduring Contributions (One per line: English | Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={contributionsInput}
                  onChange={e => setContributionsInput(e.target.value)}
                  placeholder={`Book of Optics | كتاب المناظر الخالد\nInvented Camera Obscura principle | ابتكار مبدأ القمرة المظلمة`}
                  className="w-full bg-slate-950 border border-emerald-900/80 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? '...' : editingArticleId ? (language === 'ar' ? 'حفظ التعديلات' : t('updateArticle')) : (language === 'ar' ? 'حفظ ونشر بالأرشيف' : t('saveAndPublish'))}
            </button>
          </div>
        </form>
      )}

      {/* Existing Treatises Management Table */}
      <div className="mt-12 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-classical text-lg font-bold text-slate-100">
              {language === 'ar' ? 'إدارة محتويات الأرشيف' : 'Archive Treatise Index'} ({filteredArticles.length} / {articles.length})
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'احذف أو عدل أي مقالة بنقرة واحدة، وسيتم التحديث الفوري على الموقع.' : 'Delete or edit any treatise in real-time across the platform.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTableQuery}
                onChange={e => setSearchTableQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث في العناوين والوسوم...' : 'Search articles & tags...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400"
            >
              <option value="all">{language === 'ar' ? 'كافة الأقسام' : 'All Sections'}</option>
              {Object.values(CATEGORIES).map(c => (
                <option key={c.key} value={c.key}>{c.name[language]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              {language === 'ar' ? 'لم يتم العثور على مقالات مطابقة لمعايير البحث.' : 'No treatises match the current search filters.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {filteredArticles.map(art => {
                const profile = SECTION_STYLE_PROFILES[art.category] || SECTION_STYLE_PROFILES.science;
                const isBio = !!art.metadata?.isBiography || art.category === 'science';

                return (
                  <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <img
                        src={art.coverImage}
                        alt={art.title[language]}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0 shadow"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${profile.primaryColor}`}>
                            {CATEGORIES[art.category]?.name[language]}
                          </span>
                          {isBio && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {language === 'ar' ? 'سيرة' : 'Biography'}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {art.publicationDate}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            • {art.readingTime} {t('readingTime')}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-200 truncate mt-1">
                          {art.title[language]}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {art.subtitle[language]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => openArticle(art)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition cursor-pointer"
                        title={language === 'ar' ? 'معاينة المقال' : 'Preview'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(art)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs transition cursor-pointer"
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-xs transition cursor-pointer"
                        title={language === 'ar' ? 'حذف المقال' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
