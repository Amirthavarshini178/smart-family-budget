import { formatCurrency } from '../utils/helpers';

export default function SummaryCards({ salary, totalExpenses, balance, totalSaved }) {
  const cards = [
    {
      label: 'Monthly Income',
      value: salary,
      icon: '↑',
      colorClass: 'green',
      sub: 'Salary this month',
      bg: 'var(--green-bg)',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: '↓',
      colorClass: 'red',
      sub: 'Spent this month',
      bg: 'var(--red-bg)',
    },
    {
      label: 'Net Balance',
      value: balance,
      icon: '◈',
      colorClass: balance >= 0 ? 'green' : 'red',
      sub: balance >= 0 ? 'You\'re in the green!' : 'Over budget!',
      bg: balance >= 0 ? 'var(--green-bg)' : 'var(--red-bg)',
    },
    {
      label: 'Total Saved',
      value: totalSaved,
      icon: '◇',
      colorClass: 'blue',
      sub: 'Across all goals',
      bg: 'var(--blue-bg)',
    },
  ];

  return (
    <div className="cards-grid">
      {cards.map((card) => (
        <div className="card fade-in" key={card.label} style={{ borderLeft: `3px solid` }}>
          <div className="card-label">{card.label}</div>
          <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{card.icon}</div>
          <div className={`card-amount ${card.colorClass}`}>
            {formatCurrency(card.value)}
          </div>
          <div className="card-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
