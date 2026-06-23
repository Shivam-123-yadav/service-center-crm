import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Inline icons — zero extra dependency
// ---------------------------------------------------------------------------
const IconLayoutDashboard = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const IconTicket = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 9a3 3 0 1 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </svg>
);
const IconLogout = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconSparkle = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.6 5.8L19.4 9l-5.8 1.6L12 16.4l-1.6-5.8L4.6 9l5.8-1.6z" />
  </svg>
);

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: IconTicket },
];

const initials = (name) =>
  name ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : '—';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10,14,23,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + nav links */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow: '0 4px 14px -4px rgba(99,102,241,0.6)',
                }}
              >
                <IconSparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Service<span className="text-indigo-400">CRM</span>
              </span>
            </Link>

            {isAuthenticated && (
              <div className="ml-8 flex items-center gap-1">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className="relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors"
                      style={{
                        color: active ? '#e0e7ff' : '#94a3b8',
                        background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.color = '#cbd5e1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {active && (
                        <span
                          className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full"
                          style={{ background: '#818cf8', boxShadow: '0 0 8px #818cf8' }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right side: auth state */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
                  style={{ background: menuOpen ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                  onMouseEnter={(e) => {
                    if (!menuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!menuOpen) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(129,140,248,0.18)', color: '#a5b4fc' }}
                  >
                    {initials(user?.username)}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium leading-tight text-slate-200">
                      {user?.username}
                    </span>
                    <span className="block text-xs leading-tight text-slate-500">{user?.role}</span>
                  </span>
                  <IconChevronDown
                    className="h-4 w-4 text-slate-500 transition-transform"
                    style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div
                      className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl"
                      style={{
                        background: 'linear-gradient(160deg, rgba(30,37,54,0.97), rgba(17,21,33,0.97))',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="text-sm font-medium text-slate-200">{user?.username}</p>
                        <p className="text-xs text-slate-500">{user?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
                      >
                        <IconLogout className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.03]"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)',
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;