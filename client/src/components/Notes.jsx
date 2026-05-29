import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/helpers';

const NOTE_TYPES = [
  { value: 'personal', label: '👤 Personal', color: '#3b82f6' },
  { value: 'family', label: '👨‍👩‍👧 Family', color: '#a855f7' },
  { value: 'grocery', label: '🛒 Grocery', color: '#22c55e' },
  { value: 'reminder', label: '⏰ Reminder', color: '#f59e0b' },
  { value: 'planning', label: '📅 Planning', color: '#ec4899' },
];

const TYPE_MAP = Object.fromEntries(NOTE_TYPES.map(t => [t.value, t]));

const INITIAL = { title: '', content: '', type: 'personal', pinned: false };

export default function Notes() {
  const { notes, addNote, deleteNote } = useApp();
  const [form, setForm] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    addNote({ ...form });
    setForm(INITIAL);
    setShowForm(false);
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.type === filter);
  const pinned = filtered.filter(n => n.pinned);
  const regular = filtered.filter(n => !n.pinned);
  const displayed = [...pinned, ...regular];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>Notes</h3>
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{notes.length} notes</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(p => !p)}>
          {showForm ? '✕ Cancel' : '+ New Note'}
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>All</button>
        {NOTE_TYPES.map(t => (
          <button key={t.value} className={`btn btn-sm ${filter === t.value ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="section fade-in" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>New Note</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Note title…" value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.type} onChange={set('type')}>
                  {NOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" placeholder="Write your note here…" value={form.content} onChange={set('content')} required rows={4} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Pin this note</span>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Save Note</button>
          </form>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No notes yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {displayed.map(note => {
            const typeInfo = TYPE_MAP[note.type] || TYPE_MAP['personal'];
            return (
              <div className="note-card fade-in" key={note.id} style={{ borderTop: `3px solid ${typeInfo.color}` }}>
                {note.pinned && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.8rem' }}>📌</span>}
                <div className="note-type-badge" style={{ color: typeInfo.color }}>{typeInfo.label}</div>
                <h4>{note.title}</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                <div className="note-footer">
                  <span>By {note.addedBy || 'You'} · {formatDate(note.createdAt)}</span>
                  <button className="btn btn-danger btn-icon" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => deleteNote(note.id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
