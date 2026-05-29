import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const GOAL_ICONS = ['🏍', '🥇', '🏠', '🚗', '💍', '📱', '✈️', '🎓', '🏥', '🎯'];

const INITIAL = { goalName: '', targetAmount: '', savedAmount: '', icon: '🎯', deadline: '' };

export default function SavingsTracker() {
  const { savings, addSaving, updateSaving, deleteSaving } = useApp();
  const [form, setForm] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addAmount, setAddAmount] = useState({});

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.goalName || !form.targetAmount) return;
    addSaving({
      goalName: form.goalName,
      targetAmount: parseFloat(form.targetAmount),
      savedAmount: parseFloat(form.savedAmount) || 0,
      icon: form.icon,
      deadline: form.deadline || null,
    });
    setForm(INITIAL);
    setShowForm(false);
  };

  const handleAddMoney = (id, target, current) => {
    const amt = parseFloat(addAmount[id]);
    if (isNaN(amt) || amt <= 0) return;
    const newSaved = Math.min(current + amt, target);
    updateSaving(id, { savedAmount: newSaved, completed: newSaved >= target });
    setAddAmount(p => ({ ...p, [id]: '' }));
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>Savings Goals</h3>
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{savings.length} active goals</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(p => !p)}>
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="section fade-in" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Create Savings Goal</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Goal Icon</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {GOAL_ICONS.map(ic => (
                  <button key={ic} type="button"
                    onClick={() => setForm(p => ({ ...p, icon: ic }))}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: '1.3rem',
                      border: `2px solid ${form.icon === ic ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.icon === ic ? 'var(--bg4)' : 'var(--bg3)',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >{ic}</button>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input className="form-input" placeholder="e.g. Emergency Fund" value={form.goalName} onChange={set('goalName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Target Amount (₹)</label>
                <input className="form-input" type="number" placeholder="50000" value={form.targetAmount} onChange={set('targetAmount')} min="1" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Already Saved (₹)</label>
                <input className="form-input" type="number" placeholder="0" value={form.savedAmount} onChange={set('savedAmount')} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Target Date (optional)</label>
                <input className="form-input" type="date" value={form.deadline} onChange={set('deadline')} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Goal
            </button>
          </form>
        </div>
      )}

      {savings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>No savings goals yet. Create your first goal!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
          {savings.map(goal => {
            const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
            const remaining = goal.targetAmount - goal.savedAmount;
            return (
              <div className="goal-card fade-in" key={goal.id} style={{ position: 'relative' }}>
                {goal.completed && (
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--green)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20 }}>
                    ✓ DONE
                  </div>
                )}
                <div className="goal-icon">{goal.icon}</div>
                <div className="goal-name">{goal.goalName}</div>
                {goal.deadline && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 4 }}>
                    🗓 Target: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                )}

                <div className="progress-bar" style={{ marginTop: 14 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: goal.completed ? 'var(--green)' : `linear-gradient(90deg, var(--blue), var(--purple))`
                  }} />
                </div>

                <div className="goal-amounts">
                  <span>Saved: <strong style={{ color: 'var(--green)' }}>{formatCurrency(goal.savedAmount)}</strong></span>
                  <span style={{ fontWeight: 700 }}>{pct}%</span>
                  <span>Goal: <strong>{formatCurrency(goal.targetAmount)}</strong></span>
                </div>

                {!goal.completed && (
                  <div style={{ marginTop: 12 }}>
                    {editingId === goal.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="form-input"
                          type="number"
                          placeholder={`Add up to ₹${remaining.toLocaleString('en-IN')}`}
                          value={addAmount[goal.id] || ''}
                          onChange={e => setAddAmount(p => ({ ...p, [goal.id]: e.target.value }))}
                          style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                          autoFocus
                        />
                        <button className="btn btn-success btn-sm" onClick={() => handleAddMoney(goal.id, goal.targetAmount, goal.savedAmount)}>Add</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>✕</button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setEditingId(goal.id)}>
                        + Add Money
                      </button>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                  onClick={() => deleteSaving(goal.id)}
                >
                  Delete Goal
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
