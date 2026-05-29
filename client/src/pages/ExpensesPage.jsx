import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function ExpensesPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Expenses</h2>
        <p>Track and manage all your daily expenses</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <ExpenseForm />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
