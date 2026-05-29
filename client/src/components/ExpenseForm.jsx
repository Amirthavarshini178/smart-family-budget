import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useVoice } from '../hooks/useVoice';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/helpers';

const INITIAL = { title: '', amount: '', category: 'Food', date: '', note: '' };

export default function ExpenseForm({ onAdded }) {
  const { addExpense } = useApp();
  const [form, setForm] = useState(INITIAL);
  const [voiceLang, setVoiceLang] = useState('ta-IN');
  const [voiceStatus, setVoiceStatus] = useState('');

  const handleVoiceResult = useCallback((parsed, rawText) => {
    setVoiceStatus(`Heard: "${rawText}"`);
    setForm(prev => ({
      ...prev,
      title: parsed.title || prev.title,
      amount: parsed.amount !== null ? parsed.amount : prev.amount,
      category: parsed.category || prev.category,
    }));
    setTimeout(() => setVoiceStatus(''), 4000);
  }, []);

  const { isListening, error: voiceError, startListening, stopListening } = useVoice({ onResult: handleVoiceResult });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    addExpense({
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date || new Date().toISOString(),
      note: form.note,
    });
    setForm(INITIAL);
    setVoiceStatus('');
    if (onAdded) onAdded();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="section fade-in">
      <div className="section-header">
        <div className="section-title">Add Expense</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px', fontSize: '0.78rem' }}
            value={voiceLang}
            onChange={e => setVoiceLang(e.target.value)}
          >
            <option value="ta-IN">🎙 Tamil</option>
            <option value="en-IN">🎙 English</option>
          </select>
          <button
            type="button"
            className={`voice-btn${isListening ? ' recording' : ''}`}
            onClick={isListening ? stopListening : () => startListening(voiceLang)}
            title={isListening ? 'Stop listening' : 'Voice input (say: Food 500)'}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
        </div>
      </div>

      {voiceStatus && (
        <div className="reminder" style={{ marginBottom: 16 }}>
          🎤 {voiceStatus}
        </div>
      )}
      {voiceError && (
        <div className="auth-error" style={{ marginBottom: 16 }}>{voiceError}</div>
      )}
      {isListening && (
        <div style={{ textAlign: 'center', padding: '12px', color: 'var(--red)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 12 }}>
          🔴 Listening… Say something like "Food 500" or "சாப்பாடு 200"
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" placeholder="e.g. Grocery shopping" value={form.title} onChange={set('title')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0" value={form.amount} onChange={set('amount')} min="0" step="0.01" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date ? form.date.split('T')[0] : ''} max={today} onChange={set('date')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <input className="form-input" placeholder="Any additional note…" value={form.note} onChange={set('note')} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          + Add Expense
        </button>
      </form>
    </div>
  );
}
