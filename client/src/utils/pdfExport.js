import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, getMonthLabel } from './helpers';

export function exportToPDF({ expenses, salary, savings, user, month }) {
  const doc = new jsPDF();
  const monthLabel = getMonthLabel(month);
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const balance = salary - totalExp;

  // Header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Smart Family Budget', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Monthly Report — ${monthLabel}`, 15, 30);
  doc.text(`Generated for: ${user?.name || 'User'}`, 15, 37);

  // Summary cards
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', 15, 55);

  const summaryData = [
    ['Monthly Income', formatCurrency(salary)],
    ['Total Expenses', formatCurrency(totalExp)],
    ['Balance', formatCurrency(balance)],
    ['Savings Goals', savings.length.toString()],
  ];

  doc.autoTable({
    startY: 60,
    head: [['Category', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    margin: { left: 15, right: 15 },
  });

  // Category breakdown
  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });
  const categoryRows = Object.entries(byCategory).map(([cat, amt]) => [cat, formatCurrency(amt), `${((amt / totalExp) * 100).toFixed(1)}%`]);

  if (categoryRows.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense by Category', 15, doc.lastAutoTable.finalY + 15);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Category', 'Amount', '% of Total']],
      body: categoryRows,
      theme: 'grid',
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 15, right: 15 },
    });
  }

  // Expense transactions
  if (expenses.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('All Transactions', 15, doc.lastAutoTable.finalY + 15);
    const rows = expenses.map(e => [formatDate(e.date), e.title, e.category, formatCurrency(e.amount), e.addedBy || '—']);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Date', 'Description', 'Category', 'Amount', 'Added By']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 },
    });
  }

  // Savings goals
  if (savings.length > 0) {
    doc.addPage();
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Savings Goals', 15, 20);
    const savRows = savings.map(s => [
      `${s.icon || '🎯'} ${s.goalName}`,
      formatCurrency(s.targetAmount),
      formatCurrency(s.savedAmount),
      `${Math.min(100, Math.round((s.savedAmount / s.targetAmount) * 100))}%`,
      s.completed ? 'Completed ✓' : 'In Progress',
    ]);
    doc.autoTable({
      startY: 25,
      head: [['Goal', 'Target', 'Saved', 'Progress', 'Status']],
      body: savRows,
      theme: 'grid',
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      margin: { left: 15, right: 15 },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Smart Family Budget • Page ${i} of ${pageCount} • ${new Date().toLocaleDateString('en-IN')}`, 15, 290);
  }

  doc.save(`Smart_Family_Budget_${monthLabel.replace(' ', '_')}.pdf`);
}
