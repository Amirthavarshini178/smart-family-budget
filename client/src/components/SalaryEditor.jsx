import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export default function SalaryEditor() {
  const { salary, setSalary } = useApp();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEdit = () => {
    setValue(salary || '');
    setEditing(true);
  };

  const save = () => {
    const amt = parseFloat(value);
    if (!isNaN(amt) && amt >= 0) setSalary(amt);
    setEditing(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div className="section" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <div>
          <div className="section-title">Monthly Salary</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 4 }}>
            Set your income to track budget accurately
          </div>
        </div>
        {!editing && (
          <button className="btn btn-secondary btn-sm" onClick={startEdit}>
            ✎ Edit
          </button>
        )}
      </div>

      {editing ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', fontSize: '1rem' }}>₹</span>
            <input
              className="form-input"
              style={{ paddingLeft: 28 }}
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Enter monthly salary"
              autoFocus
              min="0"
            />
          </div>
          <button className="btn btn-primary" onClick={save}>Save</button>
          <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--green)' }}>
            {salary > 0 ? formatCurrency(salary) : '—'}
          </span>
          {salary === 0 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Click Edit to add your salary</span>
          )}
        </div>
      )}
    </div>
  );
}
