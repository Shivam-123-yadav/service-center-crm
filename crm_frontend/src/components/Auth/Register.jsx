import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
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
const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconWrench = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconShield = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ROLES = [
  { value: 'customer', label: 'Customer', icon: IconUser, color: '#38bdf8' },
  { value: 'Technician', label: 'Technician', icon: IconWrench, color: '#34d399' },
  { value: 'Admin', label: 'Admin', icon: IconShield, color: '#f59e0b' },
];

const fieldBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
};

const PasswordInput = ({ id, name, value, onChange, onFocus, onBlur, placeholder, focusStyleFn, show, onToggle }) => (
  <div className="relative">
    <IconLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    <input
      id={id}
      name={name}
      type={show ? 'text' : 'password'}
      required
      placeholder={placeholder}
      className="w-full rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none transition-all"
      style={{ ...fieldBase, ...focusStyleFn(name) }}
      value={value}
      onChange={onChange}
      onFocus={() => onFocus(name)}
      onBlur={() => onBlur(null)}
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
    </button>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    setLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: 'rgba(129,140,248,0.5)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }
      : {};

  const passwordsMatch = formData.password2.length > 0 && formData.password === formData.password2;
  const passwordsMismatch = formData.password2.length > 0 && formData.password !== formData.password2;

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.12), transparent), radial-gradient(900px 600px at -10% 100%, rgba(56,189,248,0.08), transparent), #0a0e17',
      }}
    >
      <style>{`
        @keyframes regFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes regSpin { to { transform: rotate(360deg); } }
        @keyframes regFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        select.reg-select option { background: #131826; color: #e2e8f0; }
        ::placeholder { color: #64748b; }
      `}</style>

      <div className="grid w-full max-w-5xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        {/* Left: brand panel — hidden on small screens */}
        <div className="hidden flex-col lg:flex" style={{ animation: 'regFadeUp 0.6s ease-out both' }}>
          <div
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 24px -6px rgba(99,102,241,0.6)',
              animation: 'regFloat 4s ease-in-out infinite',
            }}
          >
            <IconSparkle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            Join Service<span className="text-indigo-400">CRM</span>
          </h1>
          <p className="mt-3 max-w-sm text-base text-slate-400">
            Create your account and pick the role that matches how you'll use the platform.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {ROLES.map(({ value, label, icon: Icon, color }, i) => (
              <div
                key={value}
                className="flex items-center gap-3"
                style={{ animation: `regFadeUp 0.5s ease-out ${120 + i * 90}ms both` }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${color}1f` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">
                    {value === 'customer' && 'Submit and track your own support tickets'}
                    {value === 'Technician' && 'Get assigned tickets and resolve issues'}
                    {value === 'Admin' && 'Full access to manage tickets and users'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: register card */}
        <div
          className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl lg:justify-self-end"
          style={{
            background: 'linear-gradient(160deg, rgba(30,37,54,0.9), rgba(17,21,33,0.9))',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
            animation: 'regFadeUp 0.5s ease-out 80ms both',
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
              Create your account
            </h2>
            <p className="mt-1.5 text-center text-sm text-slate-400 lg:text-left">
              Already have one?{' '}
              <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
              .
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="relative">
                  <IconMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full rounded-lg py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all"
                    style={{ ...fieldBase, ...focusStyle('email') }}
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={setFocused}
                  onBlur={setFocused}
                  placeholder="Password"
                  focusStyleFn={focusStyle}
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>

              <div>
                <label htmlFor="password2" className="sr-only">
                  Confirm password
                </label>
                <PasswordInput
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  onFocus={setFocused}
                  onBlur={setFocused}
                  placeholder="Confirm password"
                  focusStyleFn={focusStyle}
                  show={showPassword2}
                  onToggle={() => setShowPassword2((v) => !v)}
                />
                {(passwordsMatch || passwordsMismatch) && (
                  <p
                    className="mt-1.5 flex items-center gap-1 text-xs"
                    style={{ color: passwordsMatch ? '#6ee7b7' : '#fda4af' }}
                  >
                    {passwordsMatch ? <IconCheck className="h-3 w-3" /> : <IconX className="h-3 w-3" />}
                    {passwordsMatch ? 'Passwords match' : "Passwords don't match"}
                  </p>
                )}
              </div>

              {/* Role — visual selector cards */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(({ value, label, icon: Icon, color }) => {
                    const active = formData.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, role: value }))}
                        className="flex flex-col items-center gap-1.5 rounded-lg py-3 text-xs font-medium transition-all"
                        style={{
                          background: active ? `${color}1f` : 'rgba(255,255,255,0.04)',
                          color: active ? color : '#94a3b8',
                          border: `1px solid ${active ? `${color}66` : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)' }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? (
                  <>
                    <IconLoader className="h-4 w-4" style={{ animation: 'regSpin 0.8s linear infinite' }} />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;