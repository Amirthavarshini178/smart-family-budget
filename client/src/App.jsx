import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import Reports from './pages/Reports';
import NotesPage from './pages/NotesPage';
import SavingsPage from './pages/SavingsPage';
import ChatPage from './pages/ChatPage';
import SplitPage from './pages/SplitPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Page router
function PageContent({ page, onNavigate }) {
  switch (page) {
    case 'dashboard': return <Dashboard onNavigate={onNavigate} />;
    case 'expenses': return <ExpensesPage />;
    case 'reports': return <Reports />;
    case 'notes': return <NotesPage />;
    case 'savings': return <SavingsPage />;
    case 'chat': return <ChatPage />;
    case 'split': return <SplitPage />;
    case 'profile': return <Profile />;
    case 'settings': return <Settings />;
    default: return <Dashboard onNavigate={onNavigate} />;
  }
}

function AppShell() {
  const { user, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="loading">
          <div className="spinner" />
          Loading Smart Family Budget…
        </div>
      </div>
    );
  }

  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />;
  }

  return (
    <AppProvider>
      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="main-content">
          {/* Mobile top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }} className="mobile-topbar">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>Smart Family Budget</span>
          </div>
          <PageContent page={activePage} onNavigate={setActivePage} />
        </main>
      </div>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
