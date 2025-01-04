import { createContext, useContext, useState } from 'react';
import { dummyTransactions, sortTransactionsByDateDescending, groupTransactionsByMonthFromCurrent } from '../Services/TransactionsData';

// Create a context
const TransactionsContext = createContext(null);

// Actual logic that used to be in useTransactions()
function useTransactionsLogic() {
  const [transactions, setTransactions] = useState(dummyTransactions);

  const sortedTransactions = sortTransactionsByDateDescending(transactions);
  const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);

  const availableMonths = transactionsGrouped.map((g) => {
    const date = new Date(g.year, g.month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  const handleSave = (updatedTxn) => {
    setTransactions((prev) => {
      updatedTxn.amount = parseFloat(updatedTxn.amount);
      if (updatedTxn.id) {
        // Edit existing
        return prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t));
      } else {
        // Add new
        const newId = Math.max(0, ...prev.map((p) => p.id)) + 1;
        return [...prev, { ...updatedTxn, id: newId }];
      }
    });
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  return {
    transactions,
    transactionsGrouped,
    availableMonths,
    handleSave,
    handleDelete,
  };
}

// Provider that wraps children with the single instance of state
export function TransactionsProvider({ children }) {
  const value = useTransactionsLogic();
  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

// Hook to consume our context
export function useTransactions() {
  return useContext(TransactionsContext);
}
