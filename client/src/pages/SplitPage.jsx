import SplitExpense from '../components/SplitExpense';

export default function SplitPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Split Expenses</h2>
        <p>Divide bills fairly among family members</p>
      </div>
      <div className="section">
        <SplitExpense />
      </div>
    </div>
  );
}
