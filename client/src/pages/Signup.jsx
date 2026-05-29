import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Signup({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', userId: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(form.userId)) { setError('User ID can only contain letters, numbers, and underscores.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, userId: form.userId, password: form.password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      localStorage.setItem('sfb_token', data.token);
      login(data.user);
    } catch {
      // Demo mode: save to localStorage
      const users = JSON.parse(localStorage.getItem('sfb_users') || '[]');
      if (users.find(u => u.userId === form.userId)) { setError('User ID already taken. Choose another.'); setLoading(false); return; }
      const newUser = { name: form.name, userId: form.userId, password: form.password };
      users.push(newUser);
      localStorage.setItem('sfb_users', JSON.stringify(users));
      login({ id: form.userId, name: form.name, userId: form.userId, familyId: `family_${form.userId}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div style={{ fontSize: '2.5rem', marginBottom: 16, textAlign: 'center' }}>👨‍👩‍👧‍👦</div>
        <h1 style={{ textAlign: 'center' }}>Create Account</h1>
        <p className="auth-sub" style={{ textAlign: 'center' }}>Join Smart Family Budget today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="e.g. Ravi Kumar" value={form.name} onChange={set('name')} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input className="form-input" placeholder="e.g. ravi_kumar (no spaces)" value={form.userId} onChange={set('userId')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
          </div>
          <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <a onClick={onSwitch}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
