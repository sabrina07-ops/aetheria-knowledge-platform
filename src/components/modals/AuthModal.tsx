import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Check, AlertCircle, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryKey } from '../../types';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, register, language, t } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([
    'technology',
    'space',
    'literature',
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const toggleCategory = (cat: CategoryKey) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
        }
      } else if (mode === 'register') {
        if (!username.trim()) {
          setError('Please provide your name or scholar alias');
          setLoading(false);
          return;
        }
        const res = await register(email, password, username, selectedCategories);
        if (!res.success) {
          setError(res.error || (language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'Registration failed'));
        } else {
          setSuccessMsg(
            language === 'ar'
              ? `تم إنشاء حسابك بنجاح! تم إرسال رسالة تأكيد وترحيب إلى بريدك (${email.trim()}).`
              : `Account created successfully! A confirmation email was sent to ${email.trim()}.`
          );
          setTimeout(() => {
            setAuthModalOpen(false);
          }, 1800);
        }
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword: password || 'AetheriaPass2026!' }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(
            language === 'ar'
              ? 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.'
              : 'Password reset successful. You may now log in with your updated credentials.'
          );
          setMode('login');
        } else {
          setError(data.error || 'Password reset failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setAuthModalOpen(false)}
    >
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Compass className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-classical text-xl font-bold text-slate-100 tracking-wide">
            {mode === 'login' && t('signIn')}
            {mode === 'register' && t('signUp')}
            {mode === 'forgot' && (language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && (language === 'ar' ? 'سجل دخولك للوصول إلى أرشيفك وتنبيهاتك' : 'Access your personal reading archive and dispatch alerts')}
            {mode === 'register' && (language === 'ar' ? 'أنشئ حساباً لمتابعة الأقسام وتلقي الإشعارات الفورية' : 'Create an account to follow categories and receive new treatise alerts')}
            {mode === 'forgot' && (language === 'ar' ? 'أدخل بريدك الإلكتروني لتعيين كلمة مرور جديدة' : 'Enter your email to update your access key')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('usernameLabel')}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. Hypatia of Alexandria"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                {mode === 'forgot' ? (language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password') : t('passwordLabel')}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot key?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* If registering, select followed categories for notifications */}
          {mode === 'register' && (
            <div className="pt-2">
              <span className="block text-xs font-medium text-slate-300 mb-1.5">
                {language === 'ar' ? 'اختر الأقسام التي تود متابعة تنبيهاتها:' : 'Follow categories for new dispatch notifications:'}
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {Object.values(CATEGORIES).map(cat => {
                  const selected = selectedCategories.includes(cat.key);
                  return (
                    <button
                      type="button"
                      key={cat.key}
                      onClick={() => toggleCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left text-[11px] transition ${
                        selected
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-medium'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                        selected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                      }`}>
                        {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{cat.name[language]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? '...'
              : mode === 'login'
              ? t('signIn')
              : mode === 'register'
              ? t('signUp')
              : (language === 'ar' ? 'تعيين كلمة المرور' : 'Update Password')}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className="text-amber-400 hover:underline font-medium"
            >
              {t('needAccount')}
            </button>
          ) : (
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className="text-amber-400 hover:underline font-medium"
            >
              {t('alreadyHaveAccount')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
