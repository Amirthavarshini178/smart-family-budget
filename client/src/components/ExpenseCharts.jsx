import { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, formatCurrency } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function getMonthlyData(expenses) {
  const months = {};
  expenses.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    if (!months[key]) months[key] = { label, total: 0 };
    months[key].total += Number(e.amount);
  });
  return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
}

export default function ExpenseCharts() {
  const { expenses } = useApp();

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return map;
  }, [expenses]);

  const monthly = useMemo(() => getMonthlyData(expenses), [expenses]);

  const categories = Object.keys(byCategory);
  const values = Object.values(byCategory);
  const total = values.reduce((s, v) => s + v, 0);

  const pieData = {
    labels: categories,
    datasets: [{
      data: values,
      backgroundColor: categories.map(c => CATEGORY_COLORS[c] + 'cc'),
      borderColor: categories.map(c => CATEGORY_COLORS[c]),
      borderWidth: 2,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ₹${ctx.parsed.toLocaleString('en-IN')} (${((ctx.parsed / total) * 100).toFixed(1)}%)`
        }
      }
    },
  };

  const barData = {
    labels: monthly.map(([, v]) => v.label),
    datasets: [{
      label: 'Monthly Expenses',
      data: monthly.map(([, v]) => v.total),
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderColor: 'rgba(255,255,255,0.6)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}` }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', fontSize: 11 } },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888', callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}` }
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <div className="empty-icon">📊</div>
        <p>Add expenses to see your analytics charts.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24 }}>
        {/* Pie Chart */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
            Expense by Category
          </div>
          <div className="chart-container" style={{ height: 240 }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
          <div className="chart-legend" style={{ marginTop: 16 }}>
            {categories.map((cat, i) => (
              <div className="legend-item" key={cat}>
                <div className="legend-dot" style={{ background: CATEGORY_COLORS[cat] }} />
                <span>{cat}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {total > 0 ? `${((values[i] / total) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
            Monthly Trend (Last 6 months)
          </div>
          <div className="chart-container" style={{ height: 240 }}>
            <Bar data={barData} options={barOptions} />
          </div>
          <div style={{ marginTop: 16 }}>
            {monthly.slice(-3).map(([key, v]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                <span style={{ color: 'var(--text2)' }}>{v.label}</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(v.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
