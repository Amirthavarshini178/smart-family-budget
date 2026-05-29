import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { group: 'Main', items: [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'reports', icon: '◉', label: 'Reports & Analytics' },
  ]},
  { group: 'Manage', items: [
    { id: 'expenses', icon: '◎', label: 'Expenses' },
    { id: 'savings', icon: '◇', label: 'Savings Goals' },
    { id: 'split', icon: '◑', label: 'Split Expenses' },
  ]},
  { group: 'Family', items: [
    { id: 'notes', icon: '◻', label: 'Notes' },
    { id: 'chat', icon: '◈', label: 'Family Chat' },
  ]},
  { group: 'Account', items: [
    { id: 'profile', icon: '◯', label: 'Profile' },
    { id: 'settings', icon: '◰', label: 'Settings' },
  ]},
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <h1>Smart Family<br />Budget</h1>
          <span>Personal Finance Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(group => (
            <div className="nav-group" key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item${activePage === item.id ? ' active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{darkMode ? '🌙 Dark' : '☀️ Light'}</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={!darkMode} onChange={toggleDarkMode} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div style={{ padding: '10px 0', borderTop: '1px solid var(--border)', marginBottom: 10 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>@{user?.userId}</div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
            ⎋ Logout
          </button>
        </div>
      </aside>
    </>
  );
}
