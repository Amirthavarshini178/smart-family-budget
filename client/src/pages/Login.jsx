import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      localStorage.setItem('sfb_token', data.token);
      login(data.user);
    } catch {
      // Fallback: localStorage-only demo mode
      const users = JSON.parse(localStorage.getItem('sfb_users') || '[]');
      const found = users.find(u => u.userId === form.userId);
      if (!found) { setError('User ID not found. Please sign up first.'); return; }
      if (found.password !== form.password) { setError('Incorrect password.'); return; }
      login({ id: found.userId, name: found.name, userId: found.userId, familyId: `family_${found.userId}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div style={{ fontSize: '2.5rem', marginBottom: 16, textAlign: 'center' }}>💰</div>
        <h1 style={{ textAlign: 'center' }}>Welcome Back</h1>
        <p className="auth-sub" style={{ textAlign: 'center' }}>Sign in to Smart Family Budget</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input className="form-input" placeholder="Enter your user ID" value={form.userId} onChange={set('userId')} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <a onClick={onSwitch}>Create one</a>
        </div>
      </div>
    </div>
  );
}
