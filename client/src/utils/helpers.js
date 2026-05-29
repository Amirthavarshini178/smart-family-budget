export const storage = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: (key) => localStorage.removeItem(key),
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthLabel = (month) => {
  const [y, m] = month.split('-');
  return new Date(y, m - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Shopping: '#a855f7',
  Bills: '#ef4444',
  Travel: '#3b82f6',
  Medical: '#ec4899',
  Education: '#22c55e',
  Other: '#6b7280',
};

export const CATEGORIES = ['Food', 'Shopping', 'Bills', 'Travel', 'Medical', 'Education', 'Other'];

export const CATEGORY_ICONS = {
  Food: '🍱', Shopping: '🛍️', Bills: '📄', Travel: '✈️',
  Medical: '🏥', Education: '📚', Other: '💼',
};

export const generateAISuggestions = (salary, expenses, savings) => {
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const suggestions = [];
  if (salary === 0) {
    suggestions.push({ icon: '💡', text: 'Add your monthly salary to get personalized suggestions.' });
    return suggestions;
  }
  const ratio = totalExp / salary;
  if (ratio > 0.8) suggestions.push({ icon: '🚨', text: `You've spent ${Math.round(ratio * 100)}% of your income. Try to keep expenses under 70%.` });
  else if (ratio > 0.6) suggestions.push({ icon: '⚠️', text: `Spending at ${Math.round(ratio * 100)}% of income. Consider reducing non-essentials.` });
  else suggestions.push({ icon: '✅', text: `Great! You're spending ${Math.round(ratio * 100)}% of income. You're on track!` });

  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });
  const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCat) suggestions.push({ icon: '📊', text: `Your top expense: ${topCat[0]} (₹${topCat[1].toLocaleString('en-IN')}). Look for ways to reduce it.` });

  const savingsRate = (salary - totalExp) / salary;
  if (savingsRate > 0.2) suggestions.push({ icon: '🎯', text: `You're saving ${Math.round(savingsRate * 100)}% of income. Add it to a savings goal!` });
  else if (savingsRate > 0) suggestions.push({ icon: '💰', text: `Try to save at least 20% of your income. Current savings rate: ${Math.round(savingsRate * 100)}%.` });

  if (savings.length === 0) suggestions.push({ icon: '🏦', text: 'Create a savings goal like Emergency Fund or Gold to stay motivated.' });

  const foodExp = byCategory['Food'] || 0;
  if (foodExp > salary * 0.25) suggestions.push({ icon: '🍱', text: 'Food expenses are high. Meal prepping at home can save significantly.' });

  return suggestions.slice(0, 5);
};
