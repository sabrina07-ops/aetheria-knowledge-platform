import { ResourceItem } from '../types';

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'res-nasa-exoplanet',
    title: {
      en: 'NASA Exoplanet Archive & Transit Catalog',
      ar: 'أرشيف ناسا للكواكب الخارجية وفهرس العبور الفلكي',
    },
    category: 'space',
    type: 'archive',
    url: 'https://exoplanetarchive.ipac.caltech.edu/',
    authorOrSource: 'NASA / IPAC / Caltech',
    description: {
      en: 'Comprehensive open-access research repository containing orbital parameters, radial velocities, and transit light curves for over 5,500 confirmed alien worlds.',
      ar: 'مستودع بحثي مفتوح وشامل يضم المعاملات المدارية والسرعات الشعاعية ومنحنيات الضوء لأكثر من 5500 كوكب مؤكد خارج مجموعتنا الشمسية.',
    },
  },
  {
    id: 'res-jwst-mast',
    title: {
      en: 'Mikulski Archive for Space Telescopes (MAST)',
      ar: 'أرشيف ميكولسكي للتلسكوبات الفضائية (MAST)',
    },
    category: 'space',
    type: 'research',
    url: 'https://archive.stsci.edu/',
    authorOrSource: 'Space Telescope Science Institute (STScI)',
    description: {
      en: 'Direct raw and calibrated astronomical FITS data streams from the James Webb Space Telescope, Hubble, Kepler, and TESS missions.',
      ar: 'بيانات فلكية خام ومعايرة مباشرة بتنسيق FITS من تلسكوبات جيمس ويب، هابل، كبلر، وتيس الفضائية.',
    },
  },
  {
    id: 'res-stanford-phil',
    title: {
      en: 'Stanford Encyclopedia of Philosophy (SEP)',
      ar: 'موسوعة ستانفورد للفلسفة',
    },
    category: 'philosophy',
    type: 'research',
    url: 'https://plato.stanford.edu/',
    authorOrSource: 'Stanford University Center for Study of Language & Info',
    description: {
      en: 'Peer-maintained, rigorously referenced scholarly digital encyclopedia of Western, Eastern, and Islamic philosophy and metaphysics.',
      ar: 'موسوعة أكاديمية رقمية محكمة وشاملة لكافة مباحث الفلسفة الغربية، الشرقية، والإسلامية وما وراء الطبيعة.',
    },
  },
  {
    id: 'res-internet-classics',
    title: {
      en: 'The Internet Classics Archive',
      ar: 'أرشيف الكلاسيكيات الرقمي',
    },
    category: 'literature',
    type: 'archive',
    url: 'http://classics.mit.edu/',
    authorOrSource: 'Massachusetts Institute of Technology (MIT)',
    description: {
      en: 'Select collection of 441 classical Greco-Roman, Persian, and Chinese works in searchable English translation, including Homer, Plato, and Aristotle.',
      ar: 'مجموعة مختارة تضم 441 عملاً كلاسيكياً من روائع الأدب الإغريقي والروماني والفارسي والصيني في ترجمات رقمية دقيقة.',
    },
  },
  {
    id: 'res-met-open-access',
    title: {
      en: 'The Metropolitan Museum of Art Open Access Initiative',
      ar: 'مبادرة الوصول المفتوح لمتحف المتروبوليتان للفنون',
    },
    category: 'art',
    type: 'archive',
    url: 'https://www.metmuseum.org/about-the-met/policies-and-documents/open-access',
    authorOrSource: 'The Met Fifth Avenue, New York',
    description: {
      en: 'Over 400,000 public-domain masterworks available for high-resolution download, historical analysis, and unrestricted cultural scholarship.',
      ar: 'أكثر من 400,000 تحفة فنية عالمية متاحة للتحميل عالي الدقة والتحليل التاريخي والبحث الثقافي المفتوح.',
    },
  },
  {
    id: 'res-arxiv-cs',
    title: {
      en: 'arXiv Computer Science & Quantum Computation Repository',
      ar: 'مستودع أبحاث arXiv لعلوم الحاسب والحوسبة الكمية',
    },
    category: 'technology',
    type: 'research',
    url: 'https://arxiv.org/corr',
    authorOrSource: 'Cornell University Library',
    description: {
      en: 'The global standard for open-access pre-prints in artificial intelligence, neural networks, distributed systems, cryptography, and robotics.',
      ar: 'المنصة العالمية الأولى للأوراق البحثية المفتوحة في الذكاء الاصطناعي، الشبكات العصبية، التشفير، والروبوتات.',
    },
  },
  {
    id: 'res-ncbi-nih',
    title: {
      en: 'NCBI PubMed & National Center for Biotechnology Information',
      ar: 'المكتبة الوطنية الأمريكية للطب والمركز الوطني للمعلومات الحيوية',
    },
    category: 'science',
    type: 'research',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    authorOrSource: 'National Institutes of Health (NIH)',
    description: {
      en: 'Over 36 million citations for biomedical literature from MEDLINE, life science journals, and online books spanning genomics, neurobiology, and clinical biochemistry.',
      ar: 'أكثر من 36 مليون مرجع علمي ومقالة بحثية في مجالات الطب الحيوي، الجينوميات، علم الأعصاب، والكيمياء الحيوية.',
    },
  },
  {
    id: 'res-muqaddimah-book',
    title: {
      en: 'The Muqaddimah: An Introduction to History by Ibn Khaldun',
      ar: 'كتاب مقدمة ابن خلدون (ديوان المبتدأ والخبر)',
    },
    category: 'philosophy',
    type: 'book',
    url: 'https://archive.org/details/muqaddimah_ar',
    authorOrSource: 'Abd al-Rahman Ibn Khaldun (Tunis/Cairo, 1377)',
    description: {
      en: 'The foundational masterwork that inaugurated sociology, political economy, and the empirical philosophy of civilizations.',
      ar: 'المصنف التأسيسي الذي دشن علم الاجتماع والعمران البشري وفلسفة التاريخ الاقتصادية والسياسية.',
    },
  },
];
