import { createContext, useContext, useState, useEffect } from 'react';
import { sortTransactionsByDateDescending, groupTransactionsByMonthFromCurrent } from '../Services/TransactionsData';
import axios from 'axios';

const userId = 2;

// Create a context
const TransactionsContext = createContext(null);

// Actual logic that used to be in useTransactions()
function useTransactionsLogic() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get(`/api/complex/transactions/${userId}`);
        setTransactions(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const sortedTransactions = sortTransactionsByDateDescending(transactions);
  const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);

  const availableMonths = transactionsGrouped.map((g) => {
    const date = new Date(g.year, g.month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  // ...existing code...
async function handleSave(updatedTxn) {
  console.log(updatedTxn.transaction_id);
  try {
    if (updatedTxn.transaction_id) {
      await axios.put(`/api/complex/transaction/${updatedTxn.transaction_id}`, updatedTxn);
      /*setTransactions(prev =>
        prev.map(t =>
          t.transaction_id === updatedTxn.transaction_id ? { ...t, ...updatedTxn } : t
        )
      );*/
      var response = await axios.get(`/api/complex/transactions/${userId}`); //get the updated transactions
      console.log(response.data);
      setTransactions(response.data);
    } else {
      const response = await axios.post(`/api/complex/transaction`, { ...updatedTxn, user_id: userId });
      const newTransaction = { ...updatedTxn, transaction_id: response.data.transaction_id };
      setTransactions(prev => [...prev, newTransaction]);
    }
  } catch (err) {
    setError(err);
  }
}

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/complex/transaction/${id}`);
      setTransactions((prev) => prev.filter((txn) => txn.transaction_id !== id));
    } catch (err) {
      setError(err);
    }
  };

  return {
    transactions,
    transactionsGrouped,
    availableMonths,
    handleSave,
    handleDelete,
    loading,
    error,
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