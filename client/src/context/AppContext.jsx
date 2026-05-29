import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

const KEY = (uid, suffix) => `sfb_${uid}_${suffix}`;

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.userId || 'guest';

  const [expenses, setExpenses] = useState([]);
  const [salary, setSalaryState] = useState(0);
  const [savings, setSavingsState] = useState([]);
  const [notes, setNotesState] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [splits, setSplitsState] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [seniorMode, setSeniorMode] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (!user) return;
    setExpenses(load(KEY(uid, 'expenses'), []));
    setSalaryState(load(KEY(uid, 'salary'), 0));
    setSavingsState(load(KEY(uid, 'savings'), []));
    setNotesState(load(KEY(uid, 'notes'), []));
    setChatMessages(load(KEY(uid, 'chat'), []));
    setSplitsState(load(KEY(uid, 'splits'), []));
    const dm = load(KEY(uid, 'darkMode'), true);
    setDarkMode(dm);
    const sm = load(KEY(uid, 'seniorMode'), false);
    setSeniorMode(sm);
  }, [uid, user]);

  // Sync dark mode to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('senior-mode', seniorMode);
  }, [darkMode, seniorMode]);

  // Expenses
  const addExpense = useCallback((expense) => {
    const item = { ...expense, id: Date.now().toString(), date: expense.date || new Date().toISOString(), addedBy: user?.name || '' };
    setExpenses(prev => {
      const next = [item, ...prev];
      save(KEY(uid, 'expenses'), next);
      return next;
    });
  }, [uid, user]);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id);
      save(KEY(uid, 'expenses'), next);
      return next;
    });
  }, [uid]);

  // Salary
  const setSalary = useCallback((amount) => {
    setSalaryState(amount);
    save(KEY(uid, 'salary'), amount);
  }, [uid]);

  // Savings
  const addSaving = useCallback((goal) => {
    const item = { ...goal, id: Date.now().toString(), savedAmount: goal.savedAmount || 0 };
    setSavingsState(prev => {
      const next = [item, ...prev];
      save(KEY(uid, 'savings'), next);
      return next;
    });
  }, [uid]);

  const updateSaving = useCallback((id, updates) => {
    setSavingsState(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      save(KEY(uid, 'savings'), next);
      return next;
    });
  }, [uid]);

  const deleteSaving = useCallback((id) => {
    setSavingsState(prev => {
      const next = prev.filter(s => s.id !== id);
      save(KEY(uid, 'savings'), next);
      return next;
    });
  }, [uid]);

  // Notes
  const addNote = useCallback((note) => {
    const item = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString(), addedBy: user?.name || '' };
    setNotesState(prev => {
      const next = [item, ...prev];
      save(KEY(uid, 'notes'), next);
      return next;
    });
  }, [uid, user]);

  const deleteNote = useCallback((id) => {
    setNotesState(prev => {
      const next = prev.filter(n => n.id !== id);
      save(KEY(uid, 'notes'), next);
      return next;
    });
  }, [uid]);

  // Chat
  const sendMessage = useCallback((message) => {
    const item = { id: Date.now().toString(), message, senderName: user?.name || 'You', senderId: uid, createdAt: new Date().toISOString() };
    setChatMessages(prev => {
      const next = [...prev, item];
      save(KEY(uid, 'chat'), next);
      return next;
    });
  }, [uid, user]);

  // Splits
  const addSplit = useCallback((split) => {
    const perPerson = split.totalAmount / split.members.length;
    const item = {
      ...split, id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      members: split.members.map(name => ({ name, share: perPerson, paid: false }))
    };
    setSplitsState(prev => {
      const next = [item, ...prev];
      save(KEY(uid, 'splits'), next);
      return next;
    });
  }, [uid]);

  const toggleMemberPaid = useCallback((splitId, memberIndex) => {
    setSplitsState(prev => {
      const next = prev.map(s => {
        if (s.id !== splitId) return s;
        const members = s.members.map((m, i) => i === memberIndex ? { ...m, paid: !m.paid } : m);
        return { ...s, members, settled: members.every(m => m.paid) };
      });
      save(KEY(uid, 'splits'), next);
      return next;
    });
  }, [uid]);

  const deleteSplit = useCallback((id) => {
    setSplitsState(prev => {
      const next = prev.filter(s => s.id !== id);
      save(KEY(uid, 'splits'), next);
      return next;
    });
  }, [uid]);

  // Theme toggles
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      save(KEY(uid, 'darkMode'), !prev);
      return !prev;
    });
  }, [uid]);

  const toggleSeniorMode = useCallback(() => {
    setSeniorMode(prev => {
      save(KEY(uid, 'seniorMode'), !prev);
      return !prev;
    });
  }, [uid]);

  // Derived values
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSaved = savings.reduce((sum, s) => sum + Number(s.savedAmount), 0);
  const balance = salary - totalExpenses;

  return (
    <AppContext.Provider value={{
      expenses, addExpense, deleteExpense,
      salary, setSalary,
      savings, addSaving, updateSaving, deleteSaving,
      notes, addNote, deleteNote,
      chatMessages, sendMessage,
      splits, addSplit, toggleMemberPaid, deleteSplit,
      darkMode, toggleDarkMode,
      seniorMode, toggleSeniorMode,
      totalExpenses, totalSaved, balance,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
