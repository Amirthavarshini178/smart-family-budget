import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateAISuggestions, formatCurrency } from '../utils/helpers';

export default function AISuggestions() {
  const { salary, expenses, savings, totalExpenses, balance } = useApp();

  const suggestions = useMemo(
    () => generateAISuggestions(salary, expenses, savings),
    [salary, expenses, savings]
  );

  const ratio = salary > 0 ? Math.min(100, Math.round((totalExpenses / salary) * 100)) : 0;
  const savingsRate = salary > 0 ? Math.max(0, Math.round(((salary - totalExpenses) / salary) * 100)) : 0;

  return (
    <div className="ai-card">
      <div className="ai-header">
        <span style={{ fontSize: '1.4rem' }}>🤖</span>
        <div>
          <div className="ai-title">AI Finance Assistant</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Personalized insights based on your data</div>
        </div>
      </div>

      {/* Mini health bar */}
      <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text2)', fontWeight: 600 }}>Budget Health</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: ratio > 80 ? 'var(--red)' : ratio > 60 ? 'var(--yellow)' : 'var(--green)' }}>
            {ratio > 80 ? 'Critical' : ratio > 60 ? 'Moderate' : 'Healthy'}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${ratio}%`,
            background: ratio > 80 ? 'var(--red)' : ratio > 60 ? 'var(--yellow)' : 'var(--green)'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: 'var(--text3)' }}>
          <span>Spent {ratio}% of income</span>
          <span>Savings rate: {savingsRate}%</span>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        {suggestions.map((s, i) => (
          <div className="ai-suggestion-item" key={i}>
            <span style={{ marginRight: 8 }}>{s.icon}</span>{s.text}
          </div>
        ))}
      </div>

      {salary > 0 && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text2)' }}>
          💡 <strong>50/30/20 Rule:</strong> Needs {formatCurrency(salary * 0.5)} · Wants {formatCurrency(salary * 0.3)} · Save {formatCurrency(salary * 0.2)}
        </div>
      )}
    </div>
  );
}
