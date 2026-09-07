export type Language = 'en' | 'ar';
export type ThemeMode = 'dark' | 'light';

export type CategoryKey = 
  | 'technology' 
  | 'space' 
  | 'literature' 
  | 'philosophy' 
  | 'art' 
  | 'science';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface ArticleMetadata {
  // Space specific
  constellation?: string;
  celestialCoordinates?: string;
  distanceFromEarth?: string;
  missionType?: string;
  
  // Art specific
  medium?: string;
  artworkMedium?: string;
  period?: string;
  year?: string;
  galleryRoom?: string;
  provenance?: string;
  
  // Tech specific
  techStack?: string[];
  breakthroughType?: string;
  impactScore?: number;
  status?: string;
  
  // Literature & Philosophy specific
  era?: string;
  keyQuote?: LocalizedText;
  originalLanguage?: string;
  corePremise?: LocalizedText;
  originalEra?: string;
  philosophicalQuote?: string;

  // Biography & Scholar specific
  isBiography?: boolean;
  personName?: LocalizedText;
  lifespan?: string; // e.g., "965 – 1040 CE" / "1867 – 1934"
  birthPlace?: LocalizedText;
  fieldOfImpact?: LocalizedText;
  historicalEra?: LocalizedText;
  majorContributions?: LocalizedText[];
}

export interface Article {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: CategoryKey;
  tags: string[];
  coverImage: string;
  author: string;
  publicationDate: string;
  readingTime: number; // in minutes
  shortDescription: LocalizedText;
  fullContent: LocalizedText;
  featured?: boolean;
  sources?: string[];
  relatedArticleIds?: string[];
  metadata?: ArticleMetadata;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  savedArticles: string[];
  followedCategories: CategoryKey[];
  notificationPreferences: {
    inApp: boolean;
    browserPush: boolean;
  };
  readingHistory: { articleId: string; timestamp: string }[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // specific user or global broadcast
  type: 'article_published' | 'system' | 'curation';
  title: LocalizedText;
  message: LocalizedText;
  category: CategoryKey;
  articleId?: string;
  read: boolean;
  timestamp: string;
}

export interface CategoryInfo {
  key: CategoryKey;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  atmosphereDescription: LocalizedText;
  colorScheme: {
    accent: string;
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
  };
  icon: string;
}

export interface ResourceItem {
  id: string;
  title: LocalizedText;
  category: CategoryKey;
  type: 'book' | 'website' | 'tool' | 'archive' | 'research';
  url: string;
  description: LocalizedText;
  authorOrSource: string;
}
