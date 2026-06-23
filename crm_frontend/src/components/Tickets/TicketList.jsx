import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketAPI } from '../../api/axiosConfig';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Inline icons — zero extra dependency
// ---------------------------------------------------------------------------
const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M12 5v14" />
  </svg>
);
const IconEye = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEdit = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconInbox = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
const IconAlertTriangle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const STATUS_CONFIG = {
  Open: { glow: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  'In Progress': { glow: '#38bdf8', text: '#7dd3fc', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)' },
  Closed: { glow: '#34d399', text: '#6ee7b7', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)' },
};

const FILTERS = [
  { key: 'all', label: 'All', color: '#818cf8' },
  { key: 'Open', label: 'Open', color: '#f59e0b' },
  { key: 'In Progress', label: 'In progress', color: '#38bdf8' },
  { key: 'Closed', label: 'Closed', color: '#34d399' },
];

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.glow, boxShadow: `0 0 6px ${cfg.glow}` }} />
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

const IconButton = ({ to, onClick, color, hoverBg, title, children }) => {
  const Tag = to ? Link : 'button';
  return (
    <Tag
      to={to}
      onClick={onClick}
      title={title}
      aria-label={title}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
      style={{ color }}
      onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Tag>
  );
};

const TableSkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div
          className="h-4 rounded"
          style={{
            width: `${50 + (i % 4) * 12}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
            backgroundSize: '200% 100%',
            animation: 'tlShimmer 1.4s ease-in-out infinite',
          }}
        />
      </td>
    ))}
  </tr>
);

// ---------------------------------------------------------------------------
// Themed confirmation modal — replaces window.confirm
// ---------------------------------------------------------------------------
const ConfirmDeleteModal = ({ ticket, onCancel, onConfirm }) => {
  if (!ticket) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,7,12,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(160deg, rgba(30,37,54,0.97), rgba(17,21,33,0.97))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 48px -12px rgba(0,0,0,0.6)',
          animation: 'tlPopIn 0.2s ease-out both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
            style={{ background: 'rgba(244,63,94,0.12)' }}
          >
            <IconAlertTriangle className="h-5 w-5 text-rose-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Delete this ticket?</h3>
          <p className="mt-1.5 text-sm text-slate-400">
            <span className="text-slate-300">"{ticket.title}"</span> will be permanently removed. This can't be undone.
          </p>
        </div>
        <div className="flex gap-2 border-t p-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 4px 14px -4px rgba(244,63,94,0.5)' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);
  const { isAdmin, isTechnician } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getAll();
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const requestDelete = (ticket) => setPendingDelete(ticket);

  const confirmDelete = async () => {
    const id = pendingDelete.id;
    setPendingDelete(null);
    try {
      await ticketAPI.delete(id);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const filteredTickets = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const counts = {
    all: tickets.length,
    Open: tickets.filter((t) => t.status === 'Open').length,
    'In Progress': tickets.filter((t) => t.status === 'In Progress').length,
    Closed: tickets.filter((t) => t.status === 'Closed').length,
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.10), transparent), radial-gradient(900px 500px at -10% 30%, rgba(56,189,248,0.06), transparent), #0a0e17',
      }}
    >
      <style>{`
        @keyframes tlFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tlShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes tlPopIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        {/* Header */}
        <div
          className="mb-6 flex flex-wrap items-end justify-between gap-4"
          style={{ animation: 'tlFadeUp 0.5s ease-out both' }}
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Service tickets</h1>
            <p className="mt-1 text-sm text-slate-400">Track, assign, and resolve customer issues.</p>
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

        {/* Filters */}
        <div
          className="mb-6 flex flex-wrap gap-2"
          style={{ animation: 'tlFadeUp 0.5s ease-out 80ms both' }}
        >
          {FILTERS.map(({ key, label, color }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  background: active ? `${color}1f` : 'rgba(255,255,255,0.04)',
                  color: active ? color : '#94a3b8',
                  border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: active ? `0 0 0 1px ${color}33` : 'none',
                }}
              >
                {label}
                <span
                  className="rounded-full px-1.5 py-0.5 text-xs tabular-nums"
                  style={{ background: active ? `${color}26` : 'rgba(255,255,255,0.06)', color: active ? color : '#64748b' }}
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ticket table */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, rgba(30,37,54,0.7), rgba(17,21,33,0.7))',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'tlFadeUp 0.6s ease-out 160ms both',
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Assigned to</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 6 }).map((_, i) => <TableSkeletonRow key={i} />)}

                {!loading &&
                  filteredTickets.map((ticket, i) => {
                    const av = avatarStyle(ticket.customer_name);
                    return (
                      <tr
                        key={ticket.id}
                        className="transition-colors"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          animation: `tlFadeUp 0.4s ease-out ${i * 40}ms both`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td className="px-6 py-4 text-sm text-slate-500">#{ticket.id}</td>
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
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {ticket.assigned_to_name || (
                            <span className="text-slate-600">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconButton
                              to={`/tickets/${ticket.id}`}
                              title="View ticket"
                              color="#7dd3fc"
                              hoverBg="rgba(56,189,248,0.12)"
                            >
                              <IconEye className="h-4 w-4" />
                            </IconButton>
                            {(isAdmin || isTechnician) && (
                              <IconButton
                                to={`/tickets/edit/${ticket.id}`}
                                title="Edit ticket"
                                color="#6ee7b7"
                                hoverBg="rgba(52,211,153,0.12)"
                              >
                                <IconEdit className="h-4 w-4" />
                              </IconButton>
                            )}
                            {isAdmin && (
                              <IconButton
                                onClick={() => requestDelete(ticket)}
                                title="Delete ticket"
                                color="#fda4af"
                                hoverBg="rgba(244,63,94,0.12)"
                              >
                                <IconTrash className="h-4 w-4" />
                              </IconButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {!loading && filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                          <IconInbox className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-300">No tickets found</p>
                          <p className="text-sm text-slate-500">
                            {filter === 'all' ? 'Create your first ticket to get started.' : 'Try a different filter.'}
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

      <ConfirmDeleteModal
        ticket={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TicketList;