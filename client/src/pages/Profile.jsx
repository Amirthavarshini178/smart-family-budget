import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export default function Profile() {
  const { user, logout } = useAuth();
  const { expenses, savings, notes, salary, totalExpenses, balance } = useApp();

  const stats = [
    { label: 'Monthly Salary', value: formatCurrency(salary) },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses) },
    { label: 'Net Balance', value: formatCurrency(balance), colored: true, positive: balance >= 0 },
    { label: 'Expense Records', value: expenses.length },
    { label: 'Savings Goals', value: savings.length },
    { label: 'Notes Created', value: notes.length },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Your account overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Profile card */}
        <div className="section" style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--bg4)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '2rem'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>{user?.name}</h3>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: 4 }}>@{user?.userId}</p>
          <div style={{ marginTop: 16, padding: '10px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text2)' }}>
            Family ID: {user?.familyId}
          </div>
          <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={logout}>
            ⎋ Logout
          </button>
        </div>

        {/* Stats */}
        <div>
          <div className="section">
            <div className="section-title" style={{ marginBottom: 16 }}>Account Statistics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem',
                    color: s.colored ? (s.positive ? 'var(--green)' : 'var(--red)') : 'var(--text)'
                  }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title" style={{ marginBottom: 16 }}>About Smart Family Budget</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              Smart Family Budget is designed for salaried employees, housewives, families, grandparents, and senior citizens to manage finances together. Track income, expenses, savings goals, share notes, and split bills — all in one place.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-xs)', padding: '8px 14px', fontSize: '0.78rem', color: 'var(--text2)' }}>
                v1.0.0
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-xs)', padding: '8px 14px', fontSize: '0.78rem', color: 'var(--text2)' }}>
                Data stored locally
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
