import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import SummaryCards from '../components/SummaryCards';
import SalaryEditor from '../components/SalaryEditor';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import AISuggestions from '../components/AISuggestions';

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const { salary, totalExpenses, balance, totalSaved, expenses } = useApp();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-left">
          <h2>{greeting}, {user?.name?.split(' ')[0]} 👋</h2>
          <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="topbar-right">
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('reports')}>
            📊 View Reports
          </button>
        </div>
      </div>

      <SummaryCards salary={salary} totalExpenses={totalExpenses} balance={balance} totalSaved={totalSaved} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div>
          <SalaryEditor />
          <ExpenseForm />
        </div>
        <div>
          <AISuggestions />
        </div>
      </div>

      {/* Quick expense list */}
      {recentExpenses.length > 0 && (
        <div className="section" style={{ marginTop: 0 }}>
          <div className="section-header">
            <div className="section-title">Recent Expenses</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('expenses')}>
              View All →
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.title}</td>
                    <td><span className={`badge badge-${e.category.toLowerCase()}`}>{e.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)' }}>
                      ₹{Number(e.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                      {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
