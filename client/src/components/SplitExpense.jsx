import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';

const INITIAL = { title: '', totalAmount: '', membersText: '' };

export default function SplitExpense() {
  const { splits, addSplit, toggleMemberPaid, deleteSplit } = useApp();
  const [form, setForm] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const members = form.membersText.split(',').map(s => s.trim()).filter(Boolean);
    if (members.length < 2) { setError('Enter at least 2 member names, comma-separated.'); return; }
    if (!form.title || !form.totalAmount) { setError('Title and amount are required.'); return; }
    addSplit({ title: form.title, totalAmount: parseFloat(form.totalAmount), members });
    setForm(INITIAL);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>Split Expenses</h3>
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>Divide bills among family members</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(p => !p)}>
          {showForm ? '✕ Cancel' : '+ New Split'}
        </button>
      </div>

      {showForm && (
        <div className="section fade-in" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Create Expense Split</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expense Title</label>
                <input className="form-input" placeholder="e.g. Electricity Bill" value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Total Amount (₹)</label>
                <input className="form-input" type="number" placeholder="2000" value={form.totalAmount} onChange={set('totalAmount')} min="1" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Family Members (comma-separated)</label>
              <input className="form-input" placeholder="e.g. Dad, Mom, Ravi, Priya" value={form.membersText} onChange={set('membersText')} required />
            </div>
            {form.membersText && form.totalAmount && (
              <div className="reminder" style={{ marginBottom: 12 }}>
                💡 Each person pays{' '}
                <strong>{formatCurrency(parseFloat(form.totalAmount) / Math.max(1, form.membersText.split(',').filter(s => s.trim()).length))}</strong>
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Split
            </button>
          </form>
        </div>
      )}

      {splits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <p>No expense splits yet. Create one to divide family bills!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {splits.map(split => {
            const paidCount = split.members.filter(m => m.paid).length;
            return (
              <div className="section fade-in" key={split.id} style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{split.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 3 }}>
                      {formatDate(split.createdAt)} · {formatCurrency(split.totalAmount)} total · {paidCount}/{split.members.length} paid
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {split.settled && <span className="badge" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>✓ Settled</span>}
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteSplit(split.id)}>✕</button>
                  </div>
                </div>

                <div className="progress-bar" style={{ marginBottom: 16 }}>
                  <div className="progress-fill" style={{ width: `${(paidCount / split.members.length) * 100}%`, background: 'var(--green)' }} />
                </div>

                {split.members.map((member, idx) => (
                  <div className="split-member" key={idx}>
                    <div className="member-info">
                      <div className="avatar">{member.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Share: {formatCurrency(member.share)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.82rem', color: member.paid ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                        {member.paid ? '✓ Paid' : 'Pending'}
                      </span>
                      <button
                        className={`btn btn-sm ${member.paid ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => toggleMemberPaid(split.id, idx)}
                      >
                        {member.paid ? 'Undo' : 'Mark Paid'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
