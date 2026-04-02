import React, { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './supabase';

// --- HireOn SVG Logo Icon ---
const HireOnIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#111827" />
    <path d="M9 10H23M9 16H23M9 22H16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);



// --- Eye / Eye-Off Icons ---
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// --- Logged-in Dashboard ---
const Dashboard = ({ session, profile, onSignOut }) => {
  const displayName = profile?.full_name || session.user.user_metadata?.full_name || session.user.email;
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page-container">
      <div className="left-panel">
        <div style={styles.leftContent}>
          <div style={styles.logoWrap}>
            <HireOnIcon />
            <span style={styles.brandName}>Hire<b>On</b></span>
          </div>
          <div style={styles.leftText}>
            <h2 style={styles.leftHeading}>Умный рекрутинг для&nbsp;HR&#8209;команд</h2>
            <p style={styles.leftSub}>B2B платформа с AI-скринингом, парсингом талантов и аналитикой воронки найма.</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}><span style={styles.statNum}>3×</span><span style={styles.statLabel}>быстрее закрытие вакансий</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>80%</span><span style={styles.statLabel}>экономия времени HR</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>500+</span><span style={styles.statLabel}>компаний доверяют нам</span></div>
          </div>
          <div style={styles.mockCard}>
            <div style={styles.mockCardRow}><div style={styles.mockAvatar}>А</div><div><div style={styles.mockName}>Александр С.</div><div style={styles.mockRole}>Senior Frontend</div></div><div style={styles.mockBadge}>98% совпадение</div></div>
            <div style={styles.mockCardRow}><div style={{ ...styles.mockAvatar, background: '#dbeafe', color: '#1e40af' }}>Е</div><div><div style={styles.mockName}>Елена П.</div><div style={styles.mockRole}>Fullstack Engineer</div></div><div style={{ ...styles.mockBadge, background: '#dbeafe', color: '#1e40af' }}>92% совпадение</div></div>
            <div style={styles.mockCardRow}><div style={{ ...styles.mockAvatar, background: '#fef3c7', color: '#92400e' }}>И</div><div><div style={styles.mockName}>Иван С.</div><div style={styles.mockRole}>DevOps Инженер</div></div><div style={{ ...styles.mockBadge, background: '#dbeafe', color: '#1e40af' }}>87% совпадение</div></div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div style={styles.dashCard} className="auth-card fade-up">
          <div style={styles.avatarCircle}>{initials}</div>
          <h1 style={styles.dashName}>{displayName}</h1>
          <p style={styles.dashEmail}>{session.user.email}</p>

          <div className="info-grid">
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ID пользователя</span>
              <span style={styles.infoValue}>{session.user.id.slice(0, 8)}…</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Способ входа</span>
              <span style={styles.infoValue}>{session.user.app_metadata?.provider === 'google' ? '🔵 Google' : '📧 Email'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Аккаунт создан</span>
              <span style={styles.infoValue}>{new Date(session.user.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email подтверждён</span>
              <span style={styles.infoValue}>{session.user.email_confirmed_at ? '✅ Да' : '⏳ Нет'}</span>
            </div>
          </div>

          <button style={styles.signOutBtn} onClick={onSignOut}>
            Выйти из аккаунта
          </button>
        </div>
        <p style={styles.termsText}>Данные хранятся в Supabase и защищены Row Level Security.</p>
      </div>
    </div>
  );
};

// --- Main Auth Component ---
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const toggleAuth = () => {
    setIsLogin(prev => !prev);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setAuthError('');
    setShowPassword(false);
    setFormKey(k => k + 1);
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && !formData.name.trim()) errs.name = 'Введите ваше имя';
    if (!formData.email.trim()) errs.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Некорректный email';
    if (!formData.password) errs.password = 'Введите пароль';
    else if (formData.password.length < 6) errs.password = 'Минимум 6 символов';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    setAuthError('');

    if (isLogin) {
      // --- SIGN IN ---
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) setAuthError(translateError(error.message));
    } else {
      // --- SIGN UP ---
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
        },
      });
      
      if (data?.user?.identities && data.user.identities.length === 0) {
        setAuthError('Пользователь с таким email уже существует');
      } else if (error) {
        setAuthError(translateError(error.message));
      }
    }

    setIsSubmitting(false);
  };



  const translateError = (msg) => {
    if (msg.includes('Invalid login credentials')) return 'Неверный email или пароль';
    if (msg.includes('Email not confirmed')) return 'Подтвердите email перед входом';
    if (msg.includes('User already registered')) return 'Пользователь с таким email уже существует';
    if (msg.includes('Password should be')) return 'Пароль должен быть не менее 6 символов';
    if (msg.includes('Unable to validate email')) return 'Некорректный email адрес';
    return msg;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Загрузка…</div>
      </div>
    );
  }

  if (session) {
    return <Dashboard session={session} profile={profile} onSignOut={handleSignOut} />;
  }

  return (
    <div className="page-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div style={styles.leftContent}>
          <div style={styles.logoWrap}>
            <HireOnIcon />
            <span style={styles.brandName}>Hire<b>On</b></span>
          </div>
          <div style={styles.leftText}>
            <h2 style={styles.leftHeading}>Умный рекрутинг для&nbsp;HR&#8209;команд</h2>
            <p style={styles.leftSub}>B2B платформа с AI-скринингом, парсингом талантов и аналитикой воронки найма.</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}><span style={styles.statNum}>3×</span><span style={styles.statLabel}>быстрее закрытие вакансий</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>80%</span><span style={styles.statLabel}>экономия времени HR</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>500+</span><span style={styles.statLabel}>компаний доверяют нам</span></div>
          </div>
          <div style={styles.mockCard}>
            <div style={styles.mockCardRow}><div style={styles.mockAvatar}>А</div><div><div style={styles.mockName}>Александр С.</div><div style={styles.mockRole}>Senior Frontend</div></div><div style={styles.mockBadge}>98% совпадение</div></div>
            <div style={styles.mockCardRow}><div style={{ ...styles.mockAvatar, background: '#dbeafe', color: '#1e40af' }}>Е</div><div><div style={styles.mockName}>Елена П.</div><div style={styles.mockRole}>Fullstack Engineer</div></div><div style={{ ...styles.mockBadge, background: '#dbeafe', color: '#1e40af' }}>92% совпадение</div></div>
            <div style={styles.mockCardRow}><div style={{ ...styles.mockAvatar, background: '#fef3c7', color: '#92400e' }}>И</div><div><div style={styles.mockName}>Иван С.</div><div style={styles.mockRole}>DevOps Инженер</div></div><div style={{ ...styles.mockBadge, background: '#dbeafe', color: '#1e40af' }}>87% совпадение</div></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="right-panel">
        <div key={formKey} className="auth-card fade-up">
          <div className="mobile-logo">
            <HireOnIcon />
            <span style={styles.brandName}>Hire<b>On</b></span>
          </div>

          <>
            <div style={styles.cardHeader} className="fade-up delay-1">
              <h1 style={styles.cardTitle}>{isLogin ? 'С возвращением' : 'Создать аккаунт'}</h1>
              <p style={styles.cardSub}>
                {isLogin
                  ? 'Войдите в свою учётную запись, чтобы продолжить'
                  : 'Зарегистрируйтесь, чтобы начать поиск талантов'}
              </p>
            </div>

            {authError && (
              <div style={styles.authErrorBox} className="fade-up">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={styles.form} className="fade-up delay-2">
              {!isLogin && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Полное имя</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                  />
                  {errors.name && <span style={styles.errorMsg}>{errors.name}</span>}
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Корпоративный Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ivan@company.ru"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                />
                {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
              </div>

              <div style={styles.formGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Пароль</label>
                  {isLogin && <a href="#" style={styles.forgotLink}>Забыли пароль?</a>}
                </div>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: '3rem', ...(errors.password ? styles.inputError : {}) }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={styles.eyeBtn}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
              </div>

              <button
                type="submit"
                style={{ ...styles.submitBtn, ...(isSubmitting ? styles.submitBtnDisabled : {}) }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? <span style={styles.loadingDots}>Загрузка<span className="dots" /></span>
                  : isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <p style={styles.toggleText} className="fade-up delay-4">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              {' '}
              <button onClick={toggleAuth} style={styles.toggleBtn}>
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </>
        </div>

        <p style={styles.termsText}>
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="#" style={{ color: '#374151', fontWeight: 500 }}>Политикой конфиденциальности</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  leftContent: { maxWidth: '480px', width: '100%', zIndex: 1 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '3.5rem' },
  brandName: { fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff' },
  leftText: {},
  leftHeading: { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.25rem' },
  leftSub: { fontSize: '1rem', color: '#9ca3af', lineHeight: 1.65, marginBottom: '3rem' },
  statsRow: { display: 'flex', gap: '1.5rem', marginBottom: '3.5rem', alignItems: 'center' },
  stat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  statNum: { fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 },
  statLabel: { fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4, maxWidth: '80px' },
  statDivider: { width: '1px', height: '40px', background: '#374151' },
  mockCard: { background: '#1f2937', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', border: '1px solid #374151' },
  mockCardRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: '#111827', borderRadius: '8px' },
  mockAvatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 },
  mockName: { fontSize: '0.8rem', fontWeight: 600, color: '#f9fafb' },
  mockRole: { fontSize: '0.7rem', color: '#6b7280' },
  mockBadge: { marginLeft: 'auto', background: '#dcfce7', color: '#166534', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' },

  cardHeader: { marginBottom: '2rem' },
  cardTitle: { fontSize: '1.6rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', marginBottom: '0.4rem' },
  cardSub: { fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 },
  authErrorBox: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#374151' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 },
  input: { padding: '0.7rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', width: '100%', background: '#fff' },
  inputError: { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.08)' },
  errorMsg: { fontSize: '0.78rem', color: '#ef4444', marginTop: '0.1rem' },
  passwordWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '0.25rem', borderRadius: '4px', transition: 'color 0.2s' },
  submitBtn: { width: '100%', padding: '0.8rem 1.5rem', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s, transform 0.1s', marginTop: '0.25rem' },
  submitBtnDisabled: { background: '#6b7280', cursor: 'not-allowed' },
  loadingDots: {},
  divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' },
  dividerLine: { flex: 1, height: '1px', background: '#e5e7eb' },
  dividerText: { fontSize: '0.8rem', color: '#9ca3af' },
  socialBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#374151', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s' },
  toggleText: { textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' },
  toggleBtn: { background: 'none', border: 'none', color: '#111827', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' },
  termsText: { fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center', maxWidth: '360px' },
  // Dashboard styles
  dashCard: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  avatarCircle: { width: '72px', height: '72px', borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' },
  dashName: { fontSize: '1.4rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', margin: 0 },
  dashEmail: { fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.25rem' },
  dashEmail: { fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.25rem' },
  infoItem: { background: '#f9fafb', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left', border: '1px solid #e5e7eb' },
  infoLabel: { fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { fontSize: '0.85rem', color: '#111827', fontWeight: 600 },
  signOutBtn: { width: '100%', padding: '0.8rem 1.5rem', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },
};

export default Auth;
