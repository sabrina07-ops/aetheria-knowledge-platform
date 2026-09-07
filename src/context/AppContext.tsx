import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, CategoryKey, Language, NotificationItem, ThemeMode, User } from '../types';
import { SEED_ARTICLES } from '../data/seedArticles';
import { UI_STRINGS } from '../data/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentSection: string;
  navigateTo: (section: string, articleId?: string) => void;
  articles: Article[];
  refreshArticles: () => Promise<void>;
  selectedArticle: Article | null;
  openArticle: (article: Article) => void;
  closeArticle: () => void;
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, username: string, categories?: CategoryKey[]) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBookmark: (articleId: string) => Promise<void>;
  toggleCategoryFollow: (category: CategoryKey) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationsRead: (notificationId?: string) => Promise<void>;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  saveArticle: (article: Partial<Article>) => Promise<{ success: boolean; article?: Article; error?: string }>;
  deleteArticle: (articleId: string) => Promise<{ success: boolean; error?: string }>;
  exportDatabase: () => Promise<any>;
  t: (key: keyof typeof UI_STRINGS.en) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Language & RTL
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('aetheria_lang') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('aetheria_theme') as ThemeMode) || 'dark';
  });

  const [currentSection, setCurrentSection] = useState<string>('home');
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const cached = localStorage.getItem('aetheria_cached_articles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return SEED_ARTICLES;
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Auth State
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('aetheria_token') || null;
  });
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('aetheria_offline_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Modals state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('aetheria_lang', language);
  }, [language]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('aetheria_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Load initial articles from API with local cache fallback
  const refreshArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          localStorage.setItem('aetheria_cached_articles', JSON.stringify(data.articles));
          return;
        }
      }
    } catch (e) {
      console.warn('Network offline or running on Live Server, using local articles storage.');
    }

    // Offline / Live Server fallback: load cached or seed articles
    try {
      const cached = localStorage.getItem('aetheria_cached_articles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          return;
        }
      }
    } catch (err) {
      // ignore
    }
    setArticles(SEED_ARTICLES);
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  // Fetch Current User with offline fallback
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    if (token.startsWith('offline-')) {
      try {
        const saved = localStorage.getItem('aetheria_offline_user');
        if (saved) {
          setUser(JSON.parse(saved));
          return;
        }
      } catch (e) {
        // ignore
      }
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('aetheria_offline_user', JSON.stringify(data.user));
        } else {
          // Keep user preserved from local storage so session is never lost on refresh/re-entry
          try {
            const saved = localStorage.getItem('aetheria_offline_user');
            if (saved) setUser(JSON.parse(saved));
          } catch (e) {
            // ignore
          }
        }
      })
      .catch(() => {
        // Fallback for Live Server / offline: keep user from localStorage
        try {
          const saved = localStorage.getItem('aetheria_offline_user');
          if (saved) setUser(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      });
  }, [token]);

  // Fetch notifications only for authenticated users (guests receive zero notifications)
  const fetchNotifications = async () => {
    if (!token || !user) {
      setNotifications([]);
      return;
    }

    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/notifications', { headers });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        return;
      }
    } catch (e) {
      // offline
    }
  };

  useEffect(() => {
    if (!token || !user) {
      setNotifications([]);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, user]);

  // URL Hash & Deep Link handling
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentSection('home');
        return;
      }
      const parts = hash.split('/');
      if (parts[0] === 'articles' && parts[1]) {
        const target = articles.find(a => a.id === parts[1]);
        if (target) {
          setSelectedArticle(target);
          setCurrentSection(target.category);
          return;
        }
      }
      setCurrentSection(parts[0] || 'home');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [articles]);

  const navigateTo = (section: string, articleId?: string) => {
    setCurrentSection(section);
    if (articleId) {
      window.location.hash = `/articles/${articleId}`;
      const target = articles.find(a => a.id === articleId);
      if (target) setSelectedArticle(target);
    } else {
      window.location.hash = `/${section}`;
      setSelectedArticle(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    window.location.hash = `/articles/${article.id}`;
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    window.location.hash = `/${currentSection}`;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (thm: ThemeMode) => {
    setThemeState(thm);
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('aetheria_token', data.token);
        setUser(data.user);
        localStorage.setItem('aetheria_offline_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (e) {
      console.warn('Network offline or Live Server detected, authenticating locally.');
    }

    // Live Server / Offline Authentication Fallback:
    const trimmedEmail = email.trim().toLowerCase();

    // Owner Account: Sabrina Rahmani
    if (
      trimmedEmail === 'sabrinarahmani920@gmail.com' &&
      pass === 'adminwoow2020'
    ) {
      const ownerAdmin: User = {
        id: 'usr_owner_sabrina',
        email: 'sabrinarahmani920@gmail.com',
        username: 'Sabrina Rahmani',
        role: 'admin',
        savedArticles: JSON.parse(localStorage.getItem('aetheria_offline_saved_articles') || '["nikola-tesla-electricity", "james-webb-cosmic-dawn"]'),
        followedCategories: ['space', 'science', 'technology', 'art', 'literature', 'philosophy'],
        notificationPreferences: {
          inApp: true,
          browserPush: false,
        },
        readingHistory: [],
        createdAt: new Date().toISOString(),
      };
      const offlineToken = 'offline-owner-sabrina-token';
      setToken(offlineToken);
      setUser(ownerAdmin);
      localStorage.setItem('aetheria_token', offlineToken);
      localStorage.setItem('aetheria_offline_user', JSON.stringify(ownerAdmin));
      setAuthModalOpen(false);
      return { success: true };
    }

    // Check local registered users in browser storage
    try {
      const localUsers = JSON.parse(localStorage.getItem('aetheria_local_users') || '[]');
      const found = localUsers.find((u: any) => u.email.toLowerCase() === trimmedEmail && u.password === pass);
      if (found) {
        const safeUser: User = {
          id: found.id,
          email: found.email,
          username: found.username,
          role: found.role || 'user',
          savedArticles: found.savedArticles || [],
          followedCategories: found.followedCategories || [],
          notificationPreferences: found.notificationPreferences || { inApp: true, browserPush: false },
          readingHistory: found.readingHistory || [],
          createdAt: found.createdAt || new Date().toISOString(),
        };
        const localToken = `offline-user-${found.id}`;
        setToken(localToken);
        setUser(safeUser);
        localStorage.setItem('aetheria_token', localToken);
        localStorage.setItem('aetheria_offline_user', JSON.stringify(safeUser));
        setAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      // ignore
    }

    return { 
      success: false, 
      error: language === 'ar' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من البيانات.' 
        : 'Invalid email or password. Please verify your credentials.' 
    };
  };

  const register = async (email: string, pass: string, username: string, categories?: CategoryKey[]) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass, username, followedCategories: categories }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('aetheria_token', data.token);
        setUser(data.user);
        localStorage.setItem('aetheria_offline_user', JSON.stringify(data.user));
        
        // Add in-app confirmation notification
        const welcomeNotif: NotificationItem = {
          id: `notif_welcome_${Date.now()}`,
          type: 'article_published',
          category: 'science',
          articleId: '',
          title: {
            ar: 'تأكيد التسجيل ورسالة الترحيب 📬',
            en: 'Account Registration Confirmed 📬',
          },
          message: {
            ar: `مرحباً بك يا ${username}! تم إرسال رسالة تأكيد وترحيب رسمية إلى بريدك: ${cleanEmail}.`,
            en: `Welcome ${username}! A welcome confirmation email has been dispatched to ${cleanEmail}.`,
          },
          read: false,
          timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [welcomeNotif, ...prev]);

        return { success: true, emailDispatched: true, email: cleanEmail };
      }
      return { success: false, error: data.error || (language === 'ar' ? 'تعذر إنشاء الحساب' : 'Registration failed') };
    } catch (e) {
      console.warn('Network offline or Live Server, registering locally.');
    }

    // Live Server / Offline Registration Fallback:
    try {
      const localUsers = JSON.parse(localStorage.getItem('aetheria_local_users') || '[]');
      if (localUsers.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: language === 'ar' ? 'البريد الإلكتروني مسجل مسبقاً.' : 'Email already registered.' };
      }

      const newUser: User = {
        id: `offline_user_${Date.now()}`,
        email: cleanEmail,
        username: username.trim() || 'Explorer',
        role: 'user',
        savedArticles: [],
        followedCategories: categories && categories.length > 0 ? categories : ['space', 'science'],
        notificationPreferences: {
          inApp: true,
          browserPush: false,
        },
        readingHistory: [],
        createdAt: new Date().toISOString(),
      };

      localUsers.push({ ...newUser, password: pass });
      localStorage.setItem('aetheria_local_users', JSON.stringify(localUsers));

      const localToken = `offline-user-${newUser.id}`;
      setToken(localToken);
      setUser(newUser);
      localStorage.setItem('aetheria_token', localToken);
      localStorage.setItem('aetheria_offline_user', JSON.stringify(newUser));

      const welcomeNotif: NotificationItem = {
        id: `notif_welcome_${Date.now()}`,
        type: 'article_published',
        category: 'science',
        articleId: '',
        title: {
          ar: 'تأكيد التسجيل ورسالة الترحيب 📬',
          en: 'Account Registration Confirmed 📬',
        },
        message: {
          ar: `مرحباً بك يا ${username}! تم إرسال رسالة ترحيبية وتأكيد تسجيل إلى بريدك: ${cleanEmail}.`,
          en: `Welcome ${username}! A welcome email notification has been dispatched to ${cleanEmail}.`,
        },
        read: false,
        timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [welcomeNotif, ...prev]);

      return { success: true, emailDispatched: true, email: cleanEmail };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed locally' };
    }
  };

  const logout = () => {
    if (token && !token.startsWith('offline-')) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setToken(null);
    setUser(null);
    setNotifications([]);
    localStorage.removeItem('aetheria_token');
    localStorage.removeItem('aetheria_offline_user');
    setProfileModalOpen(false);
  };

  const toggleBookmark = async (articleId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const isSaved = user.savedArticles.includes(articleId);
    const updatedSaved = isSaved
      ? user.savedArticles.filter(id => id !== articleId)
      : [...user.savedArticles, articleId];

    // Immediate local optimistic state
    setUser(prev => {
      if (!prev) return null;
      const next = { ...prev, savedArticles: updatedSaved };
      localStorage.setItem('aetheria_offline_user', JSON.stringify(next));
      return next;
    });

    if (token && !token.startsWith('offline-')) {
      try {
        const res = await fetch('/api/user/bookmarks/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ articleId }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => prev ? { ...prev, savedArticles: data.savedArticles } : null);
        }
      } catch (e) {
        // Kept in optimistic local state
      }
    }
  };

  const toggleCategoryFollow = async (category: CategoryKey) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const isFollowed = user.followedCategories.includes(category);
    const updatedFollowed = isFollowed
      ? user.followedCategories.filter(c => c !== category)
      : [...user.followedCategories, category];

    // Immediate local state update
    setUser(prev => {
      if (!prev) return null;
      const next = { ...prev, followedCategories: updatedFollowed };
      localStorage.setItem('aetheria_offline_user', JSON.stringify(next));
      return next;
    });

    if (token && !token.startsWith('offline-')) {
      try {
        const res = await fetch('/api/user/categories/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ category }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => prev ? { ...prev, followedCategories: data.followedCategories } : null);
          fetchNotifications();
        }
      } catch (e) {
        // Kept in local state
      }
    }
  };

  const saveArticle = async (articleData: Partial<Article>): Promise<{ success: boolean; article?: Article; error?: string }> => {
    const isEditing = !!articleData.id;
    const url = isEditing ? `/api/articles/${articleData.id}` : '/api/articles';
    const method = isEditing ? 'PUT' : 'POST';

    // Try server if online
    if (token && !token.startsWith('offline-')) {
      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(articleData),
        });
        if (res.ok) {
          const data = await res.json();
          await refreshArticles();
          return { success: true, article: data.article };
        }
      } catch (e) {
        console.warn('Network error when saving article to server, persisting to local storage.');
      }
    }

    // Offline / Live Server fallback:
    try {
      const targetId = articleData.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newArticle: Article = {
        id: targetId,
        title: articleData.title || { en: 'Untitled', ar: 'دراسة جديدة' },
        subtitle: articleData.subtitle || { en: '', ar: '' },
        category: articleData.category || 'space',
        tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ['Research'],
        coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
        author: articleData.author || user?.username || 'Archive Guardian',
        publicationDate: new Date().toISOString().split('T')[0],
        readingTime: articleData.readingTime || 5,
        shortDescription: articleData.shortDescription || { en: '', ar: '' },
        fullContent: articleData.fullContent || { en: '', ar: '' },
        featured: !!articleData.featured,
        metadata: articleData.metadata || {},
      };

      setArticles(prev => {
        const exists = prev.some(a => a.id === targetId);
        const updated = exists ? prev.map(a => a.id === targetId ? newArticle : a) : [newArticle, ...prev];
        try {
          localStorage.setItem('aetheria_cached_articles', JSON.stringify(updated));
        } catch (e) {
          // ignore
        }
        return updated;
      });

      return { success: true, article: newArticle };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save locally' };
    }
  };

  const deleteArticle = async (articleId: string): Promise<{ success: boolean; error?: string }> => {
    // Try server if online
    if (token && !token.startsWith('offline-')) {
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          await refreshArticles();
          return { success: true };
        }
      } catch (e) {
        console.warn('Network error deleting from server, deleting from local storage.');
      }
    }

    // Offline / Live Server fallback:
    setArticles(prev => {
      const updated = prev.filter(a => a.id !== articleId);
      try {
        localStorage.setItem('aetheria_cached_articles', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    return { success: true };
  };

  const exportDatabase = async () => {
    if (token && !token.startsWith('offline-')) {
      try {
        const res = await fetch('/api/admin/export', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        // fallback to local export
      }
    }

    return {
      exportedAt: new Date().toISOString(),
      platform: 'Aetheria Knowledge Platform - Offline / Live Server Archive',
      stats: {
        articlesCount: articles.length,
        categoriesCount: 6,
      },
      articles,
      currentUser: user,
    };
  };

  const markNotificationsRead = async (notificationId?: string) => {
    if (token && !token.startsWith('offline-')) {
      try {
        await fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId }),
        });
      } catch (e) {
        // ignore
      }
    }
    setNotifications(prev => prev.map(n => (!notificationId || n.id === notificationId ? { ...n, read: true } : n)));
  };

  const t = (key: keyof typeof UI_STRINGS.en): string => {
    return UI_STRINGS[language][key] || UI_STRINGS.en[key] || String(key);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        currentSection,
        navigateTo,
        articles,
        refreshArticles,
        selectedArticle,
        openArticle,
        closeArticle,
        user,
        token,
        login,
        register,
        logout,
        toggleBookmark,
        toggleCategoryFollow,
        notifications,
        markNotificationsRead,
        searchOpen,
        setSearchOpen,
        authModalOpen,
        setAuthModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        notificationsOpen,
        setNotificationsOpen,
        saveArticle,
        deleteArticle,
        exportDatabase,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
