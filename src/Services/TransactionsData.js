import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../Config';

const userId = 2;

export function sortTransactionsByDateDescending(txns) {
  return [...txns].sort((a, b) => {
    const dateA = new Date(a.transaction_date);
    const dateB = new Date(b.transaction_date);
    return dateB - dateA;
  });
}

export function groupTransactionsByMonthFromCurrent(txns) {
  if (!txns || txns.length === 0) return [];

  const sorted = sortTransactionsByDateDescending(txns);
  const newest = sorted[0];
  const oldest = sorted[sorted.length - 1];

  const newestDate = new Date(newest.transaction_date);
  const oldestDate = new Date(oldest.transaction_date);

  let currentYear = newestDate.getFullYear();
  let currentMonth = newestDate.getMonth();
  const oldestYear = oldestDate.getFullYear();
  const oldestMonth = oldestDate.getMonth();

  const results = [];
  while (currentYear > oldestYear || (currentYear === oldestYear && currentMonth >= oldestMonth)) {
    const monthlyTxns = sorted.filter(tx => {
      const d = new Date(tx.transaction_date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    results.push({ year: currentYear, month: currentMonth, transactions: monthlyTxns });
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }
  return results;
}

export function transformMonthTransactionsToDailyData(transactions) {
  const dailyMap = {};

  transactions.forEach(txn => {
    const day = new Date(txn.transaction_date).getDate();
    if (!dailyMap[day]) {
      dailyMap[day] = {
        date: String(day).padStart(2, '0'),
        income: 0,
        expense: 0
      };
    }
    if (txn.transaction_type === 'Income') {
      dailyMap[day].income += parseFloat(txn.transaction_amount);
    } else if (txn.transaction_type === 'Expense') {
      dailyMap[day].expense += parseFloat(txn.transaction_amount);
    }
  });

  return Object.values(dailyMap).sort((a, b) => parseInt(a.date) - parseInt(b.date));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        console.log('hello world');
        const response = await axios.get(
          `${config.apiBaseUrl}/api/complex/transactions/${userId}`
        );
        console.log('Fetched transactions:', response.data);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err);
      } finally {
        setLoading(false);
        console.log('bye world');
      }
    }

    fetchTransactions();
  }, []);

  const sortedTransactions = sortTransactionsByDateDescending(transactions);
  const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);

  console.log('Sorted transactions:', sortedTransactions);
  console.log('Grouped transactions:', transactionsGrouped);

  const availableMonths = transactionsGrouped.map((g) => {
    const date = new Date(g.year, g.month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  const handleSave = async (updatedTxn) => {
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/${userId}/transactions`,
        updatedTxn
      );

      setTransactions((prev) => {
        if (updatedTxn.id) {
          return prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t));
        } else {
          const newId = Math.max(0, ...prev.map((p) => p.id)) + 1;
          return [...prev, { ...updatedTxn, id: newId }];
        }
      });
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.apiBaseUrl}/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
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