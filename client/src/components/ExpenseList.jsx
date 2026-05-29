import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS } from '../utils/helpers';

const PERIODS = ['All', 'Today', 'This Week', 'This Month'];

function isInPeriod(dateStr, period) {
  const d = new Date(dateStr);
  const now = new Date();
  if (period === 'All') return true;
  if (period === 'Today') return d.toDateString() === now.toDateString();
  if (period === 'This Week') {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return d >= weekStart;
  }
  if (period === 'This Month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  return true;
}

export default function ExpenseList() {
  const { expenses, deleteExpense } = useApp();
  const [period, setPeriod] = useState('This Month');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return expenses.filter(e =>
      isInPeriod(e.date, period) &&
      (category === 'All' || e.category === category) &&
      (search === '' || e.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [expenses, period, category, search]);

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  const getBadgeClass = (cat) => `badge badge-${cat.toLowerCase()}`;

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Expenses</div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 500 }}>
          {filtered.length} entries · {formatCurrency(total)}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <input
          className="form-input"
          placeholder="🔍 Search expenses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 180px', padding: '8px 12px', fontSize: '0.85rem' }}
        />
        <select
          className="form-select"
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{ flex: '0 0 auto', width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          {PERIODS.map(p => <option key={p}>{p}</option>)}
        </select>
        <select
          className="form-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ flex: '0 0 auto', width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No expenses found for this filter.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Added By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(expense => (
                <tr key={expense.id} className="fade-in">
                  <td>
                    <div style={{ fontWeight: 500 }}>{expense.title}</div>
                    {expense.note && <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{expense.note}</div>}
                  </td>
                  <td>
                    <span className={getBadgeClass(expense.category)}>
                      {CATEGORY_ICONS[expense.category]} {expense.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{formatDate(expense.date)}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)' }}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{expense.addedBy || '—'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() => deleteExpense(expense.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
