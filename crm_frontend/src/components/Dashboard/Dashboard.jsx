import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketAPI } from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// ---------------------------------------------------------------------------
// Inline icons — zero extra dependency
// ---------------------------------------------------------------------------
const IconTicket = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 9a3 3 0 1 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </svg>
);
const IconInbox = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheckCircle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M12 5v14" />
  </svg>
);
const IconArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);
const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const IconSparkle = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.6 5.8L19.4 9l-5.8 1.6L12 16.4l-1.6-5.8L4.6 9l5.8-1.6z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Count-up hook — animates a number from 0 to target whenever target changes
// ---------------------------------------------------------------------------
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (typeof target !== 'number') return;
    startRef.current = null;
    let raf;
    const tick = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const STATUS_CONFIG = {
  Open: { glow: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  'In Progress': { glow: '#38bdf8', text: '#7dd3fc', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)' },
  Closed: { glow: '#34d399', text: '#6ee7b7', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)' },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: cfg.glow, boxShadow: `0 0 6px ${cfg.glow}` }}
      />
      {status}
    </span>
  );
};

const initials = (name) =>
  name ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : '—';

const AVATAR_PALETTE = [
  { bg: 'rgba(129,140,248,0.18)', text: '#a5b4fc' },
  { bg: 'rgba(244,114,182,0.18)', text: '#f9a8d4' },
  { bg: 'rgba(45,212,191,0.18)', text: '#5eead4' },
  { bg: 'rgba(251,146,60,0.18)', text: '#fdba74' },
  { bg: 'rgba(167,139,250,0.18)', text: '#c4b5fd' },
];
const avatarStyle = (name) => {
  if (!name) return { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' };
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
};

// ---------------------------------------------------------------------------
// Stat card with animated radial progress ring + glow-on-hover border
// ---------------------------------------------------------------------------
const RingStatCard = ({ label, value, total, color, icon: Icon, delay }) => {
  const animatedValue = useCountUp(value);
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const animatedPct = useCountUp(total > 0 ? pct : 0);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300"
      style={{
        background: 'linear-gradient(160deg, rgba(30,37,54,0.9), rgba(17,21,33,0.9))',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: `dashFadeUp 0.6s ease-out ${delay}ms both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}55`;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${color}33, 0 8px 24px -8px ${color}40`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: color }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{animatedValue}</p>
          {total > 0 && (
            <p className="mt-1 text-xs text-slate-500">{pct}% of all tickets</p>
          )}
        </div>

        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 4px ${color}80)` }}
            />
          </svg>
          <div
            className="absolute flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: `${color}1a` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TableSkeletonRow = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div
          className="h-4 rounded"
          style={{
            width: `${60 + (i % 3) * 15}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
            backgroundSize: '200% 100%',
            animation: 'dashShimmer 1.4s ease-in-out infinite',
          }}
        />
      </td>
    ))}
  </tr>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getAll();
      setTickets(response.data);

      const total = response.data.length;
      const open = response.data.filter((t) => t.status === 'Open').length;
      const inProgress = response.data.filter((t) => t.status === 'In Progress').length;
      const closed = response.data.filter((t) => t.status === 'Closed').length;

      setStats({ total, open, inProgress, closed });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const firstName = user?.username?.split(' ')[0] || user?.username;

  const filtered = tickets
    .filter(
      (t) =>
        t.title?.toLowerCase().includes(query.toLowerCase()) ||
        t.customer_name?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.10), transparent), radial-gradient(900px 500px at -10% 30%, rgba(56,189,248,0.06), transparent), #0a0e17',
      }}
    >
      <style>{`
        @keyframes dashFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dashShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes dashPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        {/* Header */}
        <div
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
          style={{ animation: 'dashFadeUp 0.5s ease-out both' }}
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <IconSparkle className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-indigo-400">Service center</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome back, <span className="text-indigo-300">{firstName}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">Here's the pulse of your support queue right now.</p>
          </div>

          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets or customers..."
              className="w-64 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-400/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RingStatCard label="Total tickets" value={stats.total} total={0} icon={IconTicket} color="#818cf8" delay={0} />
          <RingStatCard label="Open" value={stats.open} total={stats.total} icon={IconInbox} color="#f59e0b" delay={80} />
          <RingStatCard label="In progress" value={stats.inProgress} total={stats.total} icon={IconClock} color="#38bdf8" delay={160} />
          <RingStatCard label="Closed" value={stats.closed} total={stats.total} icon={IconCheckCircle} color="#34d399" delay={240} />
        </div>

        {/* Recent tickets */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, rgba(30,37,54,0.7), rgba(17,21,33,0.7))',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'dashFadeUp 0.6s ease-out 320ms both',
          }}
        >
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div>
              <h2 className="text-base font-semibold text-white">Recent tickets</h2>
              <p className="text-sm text-slate-400">Live view of your most recent activity</p>
            </div>
            <Link
              to="/tickets/create"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)' }}
            >
              <IconPlus className="h-4 w-4" />
              Create ticket
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => <TableSkeletonRow key={i} />)}

                {!loading &&
                  filtered.map((ticket, i) => {
                    const av = avatarStyle(ticket.customer_name);
                    return (
                      <tr
                        key={ticket.id}
                        className="group transition-colors"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          animation: `dashFadeUp 0.4s ease-out ${i * 60}ms both`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-100">{ticket.title}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                              style={{ background: av.bg, color: av.text }}
                            >
                              {initials(ticket.customer_name)}
                            </span>
                            <span className="text-sm text-slate-300">{ticket.customer_name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={ticket.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-indigo-200"
                          >
                            View
                            <IconArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                          <IconInbox className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-300">
                            {query ? 'No matching tickets' : 'No tickets yet'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {query ? 'Try a different search term.' : 'Create your first ticket to get started.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;