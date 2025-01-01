import { useState } from 'react';
import TransactionBox from '../components/TransactionBox';
import Transaction from '../components/Transaction'; // Import the Transaction component
import MonthlySwitcher from '../components/MonthlySwitcher';
import TransactionInput from '../components/TransactionInput';

function Transactions() {
  // Give each transaction a unique ID
  const dummyTransactions = [
    {
      id: 1,
      date: '2024-05-02',
      amount: 2500,
      accountFrom: 'Checking',
      transactionName: 'Salary',
      category: 'Salary',
      type: 'income',
      currency: 'USD',
    },
    {
      id: 2,
      date: '2023-06-02',
      amount: 50,
      accountFrom: 'Checking',
      transactionName: 'Groceries',
      category: 'Food',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 3,
      date: '2023-07-03',
      amount: 100,
      accountFrom: 'Checking',
      accountTo: 'Savings',
      transactionName: 'Transfer to Savings',
      category: 'Transfer',
      type: 'transfer',
      currency: 'USD',
    },
    {
      id: 4,
      date: '2023-08-04',
      amount: 250,
      accountFrom: 'Credit Card',
      transactionName: 'Online Shopping',
      category: 'Shopping',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 5,
      date: '2024-09-05',
      amount: 75,
      accountFrom: 'Checking',
      transactionName: 'Restaurant',
      category: 'Food',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 6,
      date: '2023-10-06',
      amount: 1000,
      accountFrom: 'Checking',
      transactionName: 'Freelance Income',
      category: 'Freelance',
      type: 'income',
      currency: 'USD',
    },
    // ... rest of your transactions, each with a unique `id`
  ];

  // Sort transactions descending by date
  function sortTransactionsByDateDescending(txns) {
    return [...txns].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Group transactions by month/year from current to oldest
  function groupTransactionsByMonthFromCurrent(txns) {
    if (!txns || txns.length === 0) {
      return [];
    }
    const oldestTransaction = txns[txns.length - 1];
    const oldestDate = new Date(oldestTransaction.date);
    const oldestYear = oldestDate.getFullYear();
    const oldestMonth = oldestDate.getMonth();

    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();

    const results = [];
    while (
      currentYear > oldestYear ||
      (currentYear === oldestYear && currentMonth >= oldestMonth)
    ) {
      const monthlyTransactions = txns.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth
        );
      });
      results.push({
        year: currentYear,
        month: currentMonth,
        transactions: monthlyTransactions,
      });
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
    }
    return results;
  }

  // Store your transactions in state
  const [transactions, setTransactions] = useState(dummyTransactions);
  // Derived data: sorted & grouped
  const sortedTransactions = sortTransactionsByDateDescending(transactions);
  const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);

  // Manage which month's index is displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (currentIndex < transactionsGrouped.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentGroup = transactionsGrouped[currentIndex] || {};
  const currentMonthTransactions = currentGroup.transactions || [];

  const getMonthYearLabel = (index) => {
    const group = transactionsGrouped[index];
    if (!group) return '';
    const { year, month } = group;
    const date = new Date(year, month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Manage the pop-up form (new or edit)
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete by ID
  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  // Edit: pass the entire transaction object
  const handleEdit = (txn) => {
    setEditData(txn);  // store existing transaction in state
    setShowForm(true);
  };

  // Save: if there's an `id`, it’s an edit; otherwise it's new
  const handleSave = (updatedTxn) => {
    setTransactions((prev) => {
      // If updatedTxn has an ID, we replace the old transaction
      if (updatedTxn.id) {
        return prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t));
      } else {
        // Otherwise, it's a new transaction -> give it a unique ID
        const newId = Math.max(0, ...prev.map((p) => p.id)) + 1;
        return [...prev, { ...updatedTxn, id: newId }];
      }
    });
  };

  return (
    <>
      <MonthlySwitcher
        displayMonthYear={getMonthYearLabel(currentIndex)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <button style={{ float: 'right' }} onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <TransactionInput
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSave}
          // Pass the transaction data if editing; null if creating new
          initialTransaction={editData}
        />
      )}

      <div>
        {currentMonthTransactions.map((txn) => (
          <TransactionBox key={txn.id}>
            <Transaction
              date={txn.date}
              amount={txn.amount}
              accountFrom={txn.accountFrom}
              accountTo={txn.accountTo}
              transactionName={txn.transactionName}
              category={txn.category}
              type={txn.type}
              currency={txn.currency}
              onEdit={() => handleEdit(txn)}
              onDelete={() => handleDelete(txn.id)}
            />
          </TransactionBox>
        ))}
      </div>
    </>
  );
}

export default Transactions;
