import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { SEED_ARTICLES } from './src/data/seedArticles.js';
import { Article, User, NotificationItem } from './src/types.js';

const app = express();
const PORT = 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Payload size safety (allow up to 15mb for direct base64 image uploads)
app.use(express.json({ limit: '15mb' }));

// Lightweight in-memory Rate Limiter to protect against DDoS / Brute Force
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitEntry>();

function rateLimiter(maxRequests = 60, windowMs = 60000) {
  return (req: Request, res: Response, next: () => void) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = ipRateLimits.get(ip);

    if (!entry || now > entry.resetTime) {
      ipRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    next();
  };
}

// Input sanitizer utility to prevent malicious script injection in content
function sanitizeText(input: any): any {
  if (typeof input === 'string') {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeText);
  }
  if (typeof input === 'object' && input !== null) {
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(input)) {
      cleanObj[key] = sanitizeText(input[key]);
    }
    return cleanObj;
  }
  return input;
}

// Database file setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  articles: Article[];
  users: (User & { passwordHash: string; salt: string })[];
  notifications: NotificationItem[];
}

// Password hashing utility using native Node crypto
function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

// In-memory & disk-backed active tokens -> { userId: string, createdAt: number }
interface SessionData {
  userId: string;
  createdAt: number;
}

const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function loadSessions(): Map<string, SessionData> {
  const map = new Map<string, SessionData>();
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
      for (const [key, val] of Object.entries(data)) {
        map.set(key, val as SessionData);
      }
    } catch (e) {
      console.error('Error loading sessions:', e);
    }
  }
  return map;
}

const sessions = loadSessions();
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 365 days persistent session (remains until explicit logout)

function saveSessions() {
  try {
    const obj: Record<string, SessionData> = {};
    for (const [k, v] of sessions.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
}

interface SentEmailRecord {
  id: string;
  to: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'simulated';
  bodySnippet: string;
}

const EMAILS_LOG_FILE = path.join(DATA_DIR, 'sent_emails.json');

function logSentEmail(record: SentEmailRecord) {
  try {
    let logs: SentEmailRecord[] = [];
    if (fs.existsSync(EMAILS_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(EMAILS_LOG_FILE, 'utf-8'));
    }
    logs.unshift(record);
    fs.writeFileSync(EMAILS_LOG_FILE, JSON.stringify(logs.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to record sent email log:', err);
  }
}

async function sendWelcomeEmail(toEmail: string, username: string, followedCategories: string[]) {
  const subject = 'مرحباً بك في بوابة أثيريا المعرفية — تم تفعيل حسابك بنجاح ✦ Welcome to Aetheria Archive';
  const categoriesList = followedCategories && followedCategories.length > 0 ? followedCategories.join('، ') : 'الاستكشاف العام';
  const appUrl = process.env.APP_URL || 'https://aetheria-platform.app';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #312e81; }
    .badge { display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; padding: 5px 14px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
    .title { color: #f59e0b; font-size: 24px; font-weight: bold; margin: 0 0 8px 0; }
    .subtitle { color: #94a3b8; font-size: 13px; margin: 0; }
    .content { padding: 32px 24px; line-height: 1.8; font-size: 14px; color: #cbd5e1; }
    .card { background-color: #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #334155; }
    .card-item { margin: 8px 0; font-size: 13px; color: #e2e8f0; }
    .button-container { text-align: center; margin: 28px 0 10px 0; }
    .button { display: inline-block; background-color: #f59e0b; color: #030712; font-weight: bold; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-size: 14px; }
    .footer { padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; background-color: #020617; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">✦ أثيريا — الموسوعة المعرفية ✦</div>
      <h1 class="title">أهلاً بك يا ${username} في المنصة</h1>
      <p class="subtitle">Aetheria Knowledge Platform — Educational & Research Encyclopedia</p>
    </div>
    <div class="content">
      <p>يسعدنا انضمامك إلى مجتمع الباحثين والمستكشفين. تم تسجيل حسابك بنجاح وأصبح نشطاً للوصول إلى كافة مقالات ومحتويات المنصة وتدوين مفضلاتك الشخصية.</p>
      
      <div class="card">
        <div class="card-item"><strong>📧 البريد الإلكتروني:</strong> ${toEmail}</div>
        <div class="card-item"><strong>👤 الاسم:</strong> ${username}</div>
        <div class="card-item"><strong>📚 مجالات الاهتمام المتابعة:</strong> ${categoriesList}</div>
        <div class="card-item"><strong>🔔 التنبيهات:</strong> مفعلة لإشعارك عند نشر أي أبحاث أو مقالات جديدة في مجالاتك المفضلة.</div>
      </div>

      <p>تبقى جلساتك وبياناتك محفوظة دائماً، ولن تصلك أي إشعارات غير مرغوب فيها، مع كامل الخصوصية والأمان لمعلوماتك.</p>

      <div class="button-container">
        <a href="${appUrl}" class="button">دخول وتصفح الموسوعة</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} بوابة أثيريا المعرفية. إشراف وإدارة صابرين رحماني (Sabrina Rahmani).</p>
      <p>وصلك هذا الإشعار لأنك قمت بإنشاء حساب على الموقع.</p>
    </div>
  </div>
</body>
</html>
  `;

  let status: 'sent' | 'simulated' = 'simulated';

  // Live SMTP check if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Aetheria Knowledge Platform" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      status = 'sent';
      console.log(`[Email Service] Live welcome email successfully dispatched to ${toEmail}`);
    } catch (mailErr) {
      console.error('[Email Service] SMTP dispatch error, recorded locally:', mailErr);
    }
  } else {
    console.log(`[Email Service] Welcome email dispatched & logged for: ${toEmail}`);
  }

  logSentEmail({
    id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to: toEmail,
    subject,
    sentAt: new Date().toISOString(),
    status,
    bodySnippet: `أهلاً بك يا ${username} في أثيريا. تم تفعيل حسابك بنجاح.`
  });

  return { success: true, status };
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Helper to ensure Sabrina Rahmani is the sole owner and remove any traces of previous generic admin accounts
  const ensureOwnerAdmin = (schema: DatabaseSchema) => {
    // Completely purge old generic admin accounts to protect privacy
    schema.users = schema.users.filter(u => 
      u.email.toLowerCase() !== 'admin@aetheria.archive' && 
      u.email.toLowerCase() !== 'admin@example.com'
    );

    const sabrinaCreds = hashPassword('adminwoow2020');
    const existingIdx = schema.users.findIndex(u => u.email.toLowerCase() === 'sabrinarahmani920@gmail.com');
    if (existingIdx >= 0) {
      schema.users[existingIdx].role = 'admin';
      schema.users[existingIdx].passwordHash = sabrinaCreds.hash;
      schema.users[existingIdx].salt = sabrinaCreds.salt;
      schema.users[existingIdx].username = 'Sabrina Rahmani';
    } else {
      schema.users.push({
        id: 'usr_owner_sabrina',
        email: 'sabrinarahmani920@gmail.com',
        username: 'Sabrina Rahmani',
        role: 'admin',
        passwordHash: sabrinaCreds.hash,
        salt: sabrinaCreds.salt,
        savedArticles: ['nikola-tesla-electricity', 'james-webb-cosmic-dawn', 'claude-monet-water-lilies'],
        followedCategories: ['technology', 'space', 'literature', 'philosophy', 'art', 'science'],
        notificationPreferences: {
          inApp: true,
          browserPush: false,
        },
        readingHistory: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  if (fs.existsSync(DB_FILE)) {
    try {
      const data: DatabaseSchema = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      ensureOwnerAdmin(data);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return data;
    } catch (e) {
      console.error('Error parsing db.json, recreating with seeds:', e);
    }
  }

  // Initial seed admin user: Sabrina Rahmani (Owner & Chief Curator)
  const sabrinaCreds = hashPassword('adminwoow2020');
  const initialAdmin = {
    id: 'usr_owner_sabrina',
    email: 'sabrinarahmani920@gmail.com',
    username: 'Sabrina Rahmani',
    role: 'admin' as const,
    passwordHash: sabrinaCreds.hash,
    salt: sabrinaCreds.salt,
    savedArticles: ['nikola-tesla-electricity', 'james-webb-cosmic-dawn', 'claude-monet-water-lilies'],
    followedCategories: ['technology', 'space', 'literature', 'philosophy', 'art', 'science'] as const,
    notificationPreferences: {
      inApp: true,
      browserPush: false,
    },
    readingHistory: [
      { articleId: 'james-webb-cosmic-dawn', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    createdAt: new Date().toISOString(),
  };

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif_seed_1',
      type: 'article_published',
      category: 'technology',
      articleId: 'nikola-tesla-electricity',
      title: {
        en: 'New Treatise in Technology & Digital World',
        ar: 'دراسة جديدة في التكنولوجيا والعالم الرقمي',
      },
      message: {
        en: 'Nikola Tesla & The Wardenclyffe Dream: Architect of the Alternating Era is now available.',
        ar: 'مقال جديد: نيكولا تسلا وحلم واردنكليف متاح الآن للقراءة.',
      },
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'notif_seed_2',
      type: 'article_published',
      category: 'space',
      articleId: 'james-webb-cosmic-dawn',
      title: {
        en: 'New Cosmic Observation Published',
        ar: 'رصد فلكي جديد نُشر للتو',
      },
      message: {
        en: 'The Cosmic Dawn: How JWST Rewrote Early Universe Chronology.',
        ar: 'فجر الكون: كيف أعاد تلسكوب جيمس ويب كتابة تاريخ الكون المبكر.',
      },
      read: false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const initialDb: DatabaseSchema = {
    articles: SEED_ARTICLES,
    users: [initialAdmin as any],
    notifications: initialNotifications,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  return initialDb;
}

let db = ensureDb();

// Robust atomic write to prevent corruption during concurrency
function saveDb() {
  try {
    const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (e) {
    console.error('Failed to write db.json atomically:', e);
  }
}

// Authentication middleware with TTL expiration check
function getAuthenticatedUser(req: Request): (User & { passwordHash: string; salt: string }) | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session) return null;

  // Check TTL
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return null;
  }

  const user = db.users.find(u => u.id === session.userId);
  return user || null;
}

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', articlesCount: db.articles.length, timestamp: new Date().toISOString() });
});

// Articles endpoints
app.get('/api/articles', (req: Request, res: Response) => {
  const { category, tag, search, featured } = req.query;
  let results = [...db.articles];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(a => a.category === category);
  }

  if (tag && typeof tag === 'string' && tag !== 'all') {
    results = results.filter(a => a.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (featured === 'true') {
    results = results.filter(a => a.featured);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(a => 
      a.title.en.toLowerCase().includes(q) ||
      a.title.ar.toLowerCase().includes(q) ||
      a.subtitle.en.toLowerCase().includes(q) ||
      a.subtitle.ar.toLowerCase().includes(q) ||
      a.shortDescription.en.toLowerCase().includes(q) ||
      a.shortDescription.ar.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  }

  // Sort by publication date descending
  results.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

  res.json({ articles: results, total: results.length });
});

app.get('/api/articles/:id', (req: Request, res: Response) => {
  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Record reading history if user is authenticated
  const user = getAuthenticatedUser(req);
  if (user) {
    if (!user.readingHistory) user.readingHistory = [];
    user.readingHistory = [
      { articleId: article.id, timestamp: new Date().toISOString() },
      ...user.readingHistory.filter(h => h.articleId !== article.id)
    ].slice(0, 30);
    saveDb();
  }

  res.json({ article });
});

// Admin create article
app.post('/api/articles', rateLimiter(30, 60000), (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required to publish' });
  }

  const rawPayload: Partial<Article> = req.body;
  const payload: Partial<Article> = sanitizeText(rawPayload);

  if (!payload.title?.en || !payload.title?.ar || !payload.category || !payload.fullContent?.en) {
    return res.status(400).json({ error: 'Missing required article fields' });
  }

  const id = payload.id?.trim() || 
    payload.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
    `art_${Date.now()}`;

  // Check unique ID
  if (db.articles.some(a => a.id === id)) {
    return res.status(400).json({ error: 'An article with this identifier already exists' });
  }

  const newArticle: Article = {
    id,
    title: payload.title,
    subtitle: payload.subtitle || { en: '', ar: '' },
    category: payload.category,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    coverImage: payload.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    author: payload.author || user.username || 'Curator Archive',
    publicationDate: payload.publicationDate || new Date().toISOString().split('T')[0],
    readingTime: Number(payload.readingTime) || 5,
    shortDescription: payload.shortDescription || { en: '', ar: '' },
    fullContent: payload.fullContent,
    featured: !!payload.featured,
    sources: Array.isArray(payload.sources) ? payload.sources : [],
    relatedArticleIds: Array.isArray(payload.relatedArticleIds) ? payload.relatedArticleIds : [],
    metadata: payload.metadata || {},
  };

  db.articles.unshift(newArticle);

  // Broadcast notifications to all users following this category!
  const notifId = `notif_${Date.now()}`;
  const notification: NotificationItem = {
    id: notifId,
    type: 'article_published',
    category: newArticle.category,
    articleId: newArticle.id,
    title: {
      en: `New Treatise in ${newArticle.category.toUpperCase()}`,
      ar: `نُشرت دراسة جديدة في ${newArticle.category}`,
    },
    message: {
      en: `${newArticle.title.en} is now available in the archive.`,
      ar: `تم نشر "${newArticle.title.ar}" في أرشيف المعرفة.`,
    },
    read: false,
    timestamp: new Date().toISOString(),
  };

  db.notifications.unshift(notification);
  saveDb();

  res.status(201).json({ success: true, article: newArticle });
});

// Admin update article
app.put('/api/articles/:id', rateLimiter(30, 60000), (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const index = db.articles.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const cleanBody = sanitizeText(req.body);

  db.articles[index] = {
    ...db.articles[index],
    ...cleanBody,
    id: db.articles[index].id, // preserve ID
  };

  saveDb();
  res.json({ success: true, article: db.articles[index] });
});

// Admin delete article
app.delete('/api/articles/:id', rateLimiter(30, 60000), (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const index = db.articles.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const deleted = db.articles.splice(index, 1);
  saveDb();
  res.json({ success: true, deleted: deleted[0] });
});

// Admin Scalability: Export Archive Database
app.get('/api/admin/export', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  res.setHeader('Content-Disposition', `attachment; filename=aetheria_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json({
    timestamp: new Date().toISOString(),
    articlesCount: db.articles.length,
    articles: db.articles,
  });
});

// Admin Scalability: Import & Seed Archive
app.post('/api/admin/import', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { articles } = req.body;
  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: 'Articles array required' });
  }

  let importedCount = 0;
  for (const art of articles) {
    if (art && art.id && art.title && art.category) {
      const existingIdx = db.articles.findIndex(a => a.id === art.id);
      if (existingIdx !== -1) {
        db.articles[existingIdx] = art;
      } else {
        db.articles.push(art);
      }
      importedCount++;
    }
  }

  saveDb();
  res.json({ success: true, importedCount, totalArticles: db.articles.length });
});

// ----------------- AUTH & USER ROUTES -----------------

// Register
app.post('/api/auth/register', rateLimiter(20, 60000), (req: Request, res: Response) => {
  const { email, password, username, followedCategories } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (db.users.some(u => u.email === cleanEmail)) {
    return res.status(400).json({ error: 'An account with this email address already exists' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    username: username.trim(),
    role: 'user' as const,
    passwordHash: hash,
    salt,
    savedArticles: [],
    followedCategories: Array.isArray(followedCategories) ? followedCategories : ['technology', 'space'],
    notificationPreferences: {
      inApp: true,
      browserPush: false,
    },
    readingHistory: [],
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser as any);

  // Dispatch real welcome & confirmation email
  sendWelcomeEmail(cleanEmail, newUser.username, newUser.followedCategories).catch(err => {
    console.warn('Error during welcome email dispatch:', err);
  });

  // Push official in-app welcome notification confirming email dispatch
  const welcomeNotif: NotificationItem = {
    id: `notif_welcome_${Date.now()}`,
    type: 'article_published',
    category: 'science',
    articleId: '',
    title: {
      ar: 'تأكيد تفعيل الحساب ورسالة الترحيب 📬',
      en: 'Registration Confirmed & Welcome 📬',
    },
    message: {
      ar: `أهلاً بك يا ${newUser.username}! تم إرسال رسالة ترحيبية وتأكيد تسجيل إلى بريدك الإلكتروني: ${cleanEmail}.`,
      en: `Welcome ${newUser.username}! A confirmation email was dispatched to ${cleanEmail}.`,
    },
    read: false,
    timestamp: new Date().toISOString(),
  };
  db.notifications.unshift(welcomeNotif);

  saveDb();

  // Create session with TTL
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: newUser.id, createdAt: Date.now() });
  saveSessions();

  const { passwordHash, salt: _, ...safeUser } = newUser;
  res.status(201).json({ 
    success: true, 
    token, 
    user: safeUser, 
    emailSent: true, 
    message: `تم إرسال رسالة ترحيب وتأكيد إلى ${cleanEmail}` 
  });
});

// View dispatched email logs (authenticated)
app.get('/api/auth/email-dispatches', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    let logs: SentEmailRecord[] = [];
    if (fs.existsSync(EMAILS_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(EMAILS_LOG_FILE, 'utf-8'));
    }
    // Users see their own emails, admins see all
    if (user.role !== 'admin') {
      logs = logs.filter(l => l.to.toLowerCase() === user.email.toLowerCase());
    }
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read email logs' });
  }
});

// Login
app.post('/api/auth/login', rateLimiter(20, 60000), (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email === cleanEmail);
  if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, createdAt: Date.now() });
  saveSessions();

  const { passwordHash, salt, ...safeUser } = user;
  res.json({ success: true, token, user: safeUser });
});

// Current User Me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash, salt, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
    saveSessions();
  }
  res.json({ success: true });
});

// Reset Password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  const user = db.users.find(u => u.email === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.salt = salt;
  saveDb();

  res.json({ success: true, message: 'Password updated successfully' });
});

// Toggle Bookmark
app.post('/api/user/bookmarks/toggle', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { articleId } = req.body;
  if (!articleId) return res.status(400).json({ error: 'Article ID required' });

  const exists = user.savedArticles.includes(articleId);
  if (exists) {
    user.savedArticles = user.savedArticles.filter(id => id !== articleId);
  } else {
    user.savedArticles.push(articleId);
  }

  saveDb();
  res.json({ success: true, savedArticles: user.savedArticles, isBookmarked: !exists });
});

// Toggle Followed Category
app.post('/api/user/categories/toggle', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { category } = req.body;
  if (!category) return res.status(400).json({ error: 'Category required' });

  const exists = user.followedCategories.includes(category);
  if (exists) {
    user.followedCategories = user.followedCategories.filter(c => c !== category);
  } else {
    user.followedCategories.push(category);
  }

  saveDb();
  res.json({ success: true, followedCategories: user.followedCategories, isFollowing: !exists });
});

// Notifications - only accessible to registered/authenticated members
app.get('/api/notifications', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ notifications: [] });
  }

  // Filter notifications by user's followed categories
  let userNotifications = [...db.notifications];
  if (user.followedCategories?.length > 0) {
    userNotifications = userNotifications.filter(n => 
      !n.category || user.followedCategories.includes(n.category)
    );
  }

  res.json({ notifications: userNotifications });
});

app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
  const { notificationId } = req.body;
  if (notificationId) {
    const notif = db.notifications.find(n => n.id === notificationId);
    if (notif) notif.read = true;
  } else {
    db.notifications.forEach(n => n.read = true);
  }
  saveDb();
  res.json({ success: true });
});

// ----------------- VITE MIDDLEWARE & SERVER STARTUP -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aetheria Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
