import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ExpenseCharts from '../components/ExpenseCharts';
import { exportToPDF } from '../utils/pdfExport';
import { formatCurrency, getCurrentMonth, getMonthLabel, CATEGORY_COLORS } from '../utils/helpers';

export default function Reports() {
  const { expenses, salary, savings } = useApp();
  const { user } = useAuth();
  const [month, setMonth] = useState(getCurrentMonth());
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(() => {
    const [y, m] = month.split('-');
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === parseInt(y) && d.getMonth() + 1 === parseInt(m);
    });
  }, [expenses, month]);

  const totalExp = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const balance = salary - totalExp;

  const byCategory = useMemo(() => {
    const map = {};
    filtered.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  }, [filtered]);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToPDF({ expenses: filtered, salary, savings, user, month });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-left">
          <h2>Reports & Analytics</h2>
          <p>Visualize your financial data</p>
        </div>
        <div className="topbar-right">
          <input
            className="form-input"
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }}
          />
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Generating…' : '⬇ Export PDF'}
          </button>
        </div>
      </div>

      {/* Month summary */}
      <div className="cards-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Income', value: salary, color: 'green' },
          { label: 'Expenses', value: totalExp, color: 'red' },
          { label: 'Balance', value: balance, color: balance >= 0 ? 'green' : 'red' },
          { label: 'Transactions', value: filtered.length, color: 'blue', isCnt: true },
        ].map(c => (
          <div className="card" key={c.label}>
            <div className="card-label">{c.label}</div>
            <div className={`card-amount ${c.color}`}>
              {c.isCnt ? c.value : formatCurrency(c.value)}
            </div>
            <div className="card-sub">{getMonthLabel(month)}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="section">
        <div className="section-title" style={{ marginBottom: 20 }}>Expense Analysis</div>
        <ExpenseCharts />
      </div>

      {/* Category table */}
      {byCategory.length > 0 && (
        <div className="section">
          <div className="section-title" style={{ marginBottom: 20 }}>Category Breakdown — {getMonthLabel(month)}</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>% of Total</th>
                <th>vs Income</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map(([cat, amt]) => (
                <tr key={cat}>
                  <td>
                    <span className={`badge badge-${cat.toLowerCase()}`}>{cat}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(amt)}</td>
                  <td style={{ color: 'var(--text2)' }}>
                    {totalExp > 0 ? ((amt / totalExp) * 100).toFixed(1) : 0}%
                  </td>
                  <td style={{ color: 'var(--text3)' }}>
                    {salary > 0 ? ((amt / salary) * 100).toFixed(1) : '—'}%
                  </td>
                  <td style={{ minWidth: 120 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${totalExp > 0 ? (amt / totalExp) * 100 : 0}%`,
                        background: CATEGORY_COLORS[cat] || '#888'
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No expenses found for {getMonthLabel(month)}.</p>
        </div>
      )}
    </div>
  );
}
