import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI, customerAPI } from '../../api/axiosConfig';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Inline icons — zero extra dependency
// ---------------------------------------------------------------------------
const IconArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconFileText = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
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

const PRIORITIES = [
  { value: 'Low', color: '#34d399', glow: 'rgba(52,211,153,0.18)' },
  { value: 'Medium', color: '#f59e0b', glow: 'rgba(245,158,11,0.18)' },
  { value: 'High', color: '#f43f5e', glow: 'rgba(244,63,94,0.18)' },
];

const STATUSES = [
  { value: 'Open', color: '#f59e0b' },
  { value: 'In Progress', color: '#38bdf8' },
  { value: 'Closed', color: '#34d399' },
];

const fieldBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
};

const FieldLabel = ({ icon: Icon, children, required }) => (
  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
    {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
    {children}
    {required && <span className="text-indigo-400">*</span>}
  </label>
);

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [focused, setFocused] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    customer: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ticketAPI.create(formData);
      toast.success('Ticket created successfully!');
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: 'rgba(129,140,248,0.5)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }
      : {};

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.10), transparent), radial-gradient(900px 500px at -10% 30%, rgba(56,189,248,0.06), transparent), #0a0e17',
      }}
    >
      <style>{`
        @keyframes ctFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ctSpin { to { transform: rotate(360deg); } }
        select.ct-select option { background: #131826; color: #e2e8f0; }
        ::placeholder { color: #64748b; }
      `}</style>

      <div className="mx-auto max-w-2xl p-6 lg:p-8">
        <button
          onClick={() => navigate('/tickets')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
          style={{ animation: 'ctFadeUp 0.4s ease-out both' }}
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to tickets
        </button>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, rgba(30,37,54,0.85), rgba(17,21,33,0.85))',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'ctFadeUp 0.5s ease-out 60ms both',
          }}
        >
          <div className="border-b px-7 pt-7 pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Create a new ticket</h1>
            <p className="mt-1 text-sm text-slate-400">Log a customer issue so your team can pick it up.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-7">
            {/* Title */}
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Checkout page returns error on save"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
                style={{ ...fieldBase, ...focusStyle('title') }}
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused(null)}
              />
            </div>

            {/* Description */}
            <div>
              <FieldLabel icon={IconFileText} required>
                Description
              </FieldLabel>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                placeholder="Describe what happened, steps to reproduce, and any error messages..."
                className="w-full resize-none rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
                style={{ ...fieldBase, ...focusStyle('description') }}
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocused('description')}
                onBlur={() => setFocused(null)}
              />
            </div>

            {/* Customer */}
            <div>
              <FieldLabel icon={IconUser} required>
                Customer
              </FieldLabel>
              <div className="relative">
                <select
                  id="customer"
                  name="customer"
                  required
                  className="ct-select w-full appearance-none rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
                  style={{ ...fieldBase, ...focusStyle('customer') }}
                  value={formData.customer}
                  onChange={handleChange}
                  onFocus={() => setFocused('customer')}
                  onBlur={() => setFocused(null)}
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} — {customer.email}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Priority — visual selector cards */}
            <div>
              <FieldLabel>Priority</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map(({ value, color, glow }) => {
                  const active = formData.priority === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: value }))}
                      className="relative flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all"
                      style={{
                        background: active ? glow : 'rgba(255,255,255,0.04)',
                        color: active ? color : '#94a3b8',
                        border: `1px solid ${active ? `${color}66` : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: color, boxShadow: active ? `0 0 6px ${color}` : 'none' }}
                      />
                      {value}
                      {active && <IconCheck className="absolute right-2 h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status — visual selector cards */}
            <div>
              <FieldLabel>Status</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map(({ value, color }) => {
                  const active = formData.status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: value }))}
                      className="relative flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all"
                      style={{
                        background: active ? `${color}1f` : 'rgba(255,255,255,0.04)',
                        color: active ? color : '#94a3b8',
                        border: `1px solid ${active ? `${color}66` : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: color, boxShadow: active ? `0 0 6px ${color}` : 'none' }}
                      />
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)',
                  transform: loading ? 'none' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? (
                  <>
                    <IconLoader className="h-4 w-4" style={{ animation: 'ctSpin 0.8s linear infinite' }} />
                    Creating...
                  </>
                ) : (
                  'Create ticket'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;