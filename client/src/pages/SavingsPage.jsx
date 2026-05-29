import SavingsTracker from '../components/SavingsTracker';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export default function SavingsPage() {
  const { savings } = useApp();
  const totalTarget = savings.reduce((s, g) => s + Number(g.targetAmount), 0);
  const totalSaved = savings.reduce((s, g) => s + Number(g.savedAmount), 0);
  const completed = savings.filter(g => g.completed).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Savings Goals</h2>
        <p>Track progress toward your financial goals</p>
      </div>

      {savings.length > 0 && (
        <div className="cards-grid" style={{ marginBottom: 28 }}>
          <div className="card">
            <div className="card-label">Total Target</div>
            <div className="card-amount blue">{formatCurrency(totalTarget)}</div>
            <div className="card-sub">Across {savings.length} goals</div>
          </div>
          <div className="card">
            <div className="card-label">Total Saved</div>
            <div className="card-amount green">{formatCurrency(totalSaved)}</div>
            <div className="card-sub">{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}% of target</div>
          </div>
          <div className="card">
            <div className="card-label">Remaining</div>
            <div className="card-amount red">{formatCurrency(totalTarget - totalSaved)}</div>
            <div className="card-sub">Still to save</div>
          </div>
          <div className="card">
            <div className="card-label">Completed</div>
            <div className="card-amount green">{completed}</div>
            <div className="card-sub">Goals achieved 🎉</div>
          </div>
        </div>
      )}

      <div className="section">
        <SavingsTracker />
      </div>
    </div>
  );
}
