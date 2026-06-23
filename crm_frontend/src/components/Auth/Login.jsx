import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Inline icons — zero extra dependency
// ---------------------------------------------------------------------------
const IconSparkle = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.6 5.8L19.4 9l-5.8 1.6L12 16.4l-1.6-5.8L4.6 9l5.8-1.6z" />
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconLock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a18.5 18.5 0 0 1-2.55 3.81M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a10.55 10.55 0 0 0 5.39-1.61" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconLoader = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const IconShieldCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconBolt = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconUsers = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const HIGHLIGHTS = [
  { icon: IconBolt, text: 'Resolve tickets faster with a unified queue' },
  { icon: IconUsers, text: 'Assign work across your support team' },
  { icon: IconShieldCheck, text: 'Role-based access for admins and agents' },
];

const fieldBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: 'rgba(129,140,248,0.5)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }
      : {};

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.12), transparent), radial-gradient(900px 600px at -10% 100%, rgba(56,189,248,0.08), transparent), #0a0e17',
      }}
    >
      <style>{`
        @keyframes loginFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loginSpin { to { transform: rotate(360deg); } }
        @keyframes loginFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        ::placeholder { color: #64748b; }
      `}</style>

      <div className="grid w-full max-w-5xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: brand panel — hidden on small screens */}
        <div className="hidden flex-col lg:flex" style={{ animation: 'loginFadeUp 0.6s ease-out both' }}>
          <div
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 24px -6px rgba(99,102,241,0.6)',
              animation: 'loginFloat 4s ease-in-out infinite',
            }}
          >
            <IconSparkle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            Service<span className="text-indigo-400">CRM</span>
          </h1>
          <p className="mt-3 max-w-sm text-base text-slate-400">
            One place to track every customer issue, from first report to resolution.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
              <div
                key={text}
                className="flex items-center gap-3"
                style={{ animation: `loginFadeUp 0.5s ease-out ${120 + i * 90}ms both` }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(129,140,248,0.12)' }}
                >
                  <Icon className="h-4 w-4 text-indigo-300" />
                </div>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: login card */}
        <div
          className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl lg:justify-self-end"
          style={{
            background: 'linear-gradient(160deg, rgba(30,37,54,0.9), rgba(17,21,33,0.9))',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
            animation: 'loginFadeUp 0.5s ease-out 80ms both',
          }}
        >
          <div className="p-8">
            <div className="mb-6 flex justify-center lg:hidden">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px -6px rgba(99,102,241,0.6)' }}
              >
                <IconSparkle className="h-5 w-5 text-white" />
              </div>
            </div>

            <h2 className="text-center text-2xl font-semibold tracking-tight text-white lg:text-left">
              Welcome back
            </h2>
            <p className="mt-1.5 text-center text-sm text-slate-400 lg:text-left">
              Sign in to your account, or{' '}
              <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                create a new one
              </Link>
              .
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <IconUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Username"
                    className="w-full rounded-lg py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all"
                    style={{ ...fieldBase, ...focusStyle('username') }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <IconLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    className="w-full rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none transition-all"
                    style={{ ...fieldBase, ...focusStyle('password') }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)' }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? (
                  <>
                    <IconLoader className="h-4 w-4" style={{ animation: 'loginSpin 0.8s linear infinite' }} />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;