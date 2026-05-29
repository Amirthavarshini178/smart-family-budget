import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { darkMode, toggleDarkMode, seniorMode, toggleSeniorMode } = useApp();
  const { user } = useAuth();
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (!window.confirm('Delete ALL your data? This cannot be undone.')) return;
    const uid = user?.userId || 'guest';
    ['expenses', 'salary', 'savings', 'notes', 'chat', 'splits'].forEach(k => {
      localStorage.removeItem(`sfb_${uid}_${k}`);
    });
    setCleared(true);
    setTimeout(() => window.location.reload(), 1200);
  };

  const settings = [
    {
      group: 'Appearance',
      items: [
        {
          label: 'Dark Mode',
          desc: 'Premium black theme for comfortable viewing',
          icon: '🌙',
          control: (
            <label className="toggle-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="toggle-slider" />
            </label>
          ),
        },
        {
          label: 'Senior-Friendly Mode',
          desc: 'Larger text and buttons for easier reading',
          icon: '👴',
          control: (
            <label className="toggle-switch">
              <input type="checkbox" checked={seniorMode} onChange={toggleSeniorMode} />
              <span className="toggle-slider" />
            </label>
          ),
        },
      ],
    },
    {
      group: 'Voice Input',
      items: [
        {
          label: 'Tamil Voice Support',
          desc: 'Voice recognition works in Tamil (ta-IN) and English (en-IN). Use Chrome browser for best results.',
          icon: '🎤',
          control: <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 700 }}>✓ Enabled</span>,
        },
        {
          label: 'Voice Command Format',
          desc: 'Say "Food 500" or "சாப்பாடு 200" to auto-fill expense form.',
          icon: '💬',
          control: null,
        },
      ],
    },
    {
      group: 'Data',
      items: [
        {
          label: 'Storage Mode',
          desc: 'Data is saved in your browser localStorage. Connect to backend API for cloud sync.',
          icon: '💾',
          control: <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Local Storage</span>,
        },
      ],
    },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Customize your Smart Family Budget experience</p>
      </div>

      {settings.map(group => (
        <div className="section" key={group.group} style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>{group.group}</div>
          {group.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '1.4rem', width: 36, textAlign: 'center' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2, maxWidth: 420 }}>{item.desc}</div>
                </div>
              </div>
              {item.control}
            </div>
          ))}
        </div>
      ))}

      {/* Danger zone */}
      <div className="section" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
        <div className="section-title" style={{ marginBottom: 8, color: 'var(--red)' }}>Danger Zone</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 16 }}>
          This will permanently delete all your expenses, notes, savings, and chat messages.
        </p>
        {cleared ? (
          <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '0.9rem' }}>✓ Data cleared. Reloading…</div>
        ) : (
          <button className="btn btn-danger" onClick={handleClearData}>
            🗑 Clear All My Data
          </button>
        )}
      </div>
    </div>
  );
}
