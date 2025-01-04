
//--------- Segmenting the data and sorting it ------------------------------------------------//
import { useState } from 'react';
// we created a dummy array of transactions, in this case the ids are ordered (later down the line they will become unordered)
export const dummyTransactions = [
    {
      id: 1,
      date: '2025-01-15',
      amount: 2500,
      accountFrom: 'Checking',
      transactionName: 'Salary',
      category: 'Salary',
      type: 'income',
      currency: 'USD',
    },
    {
      id: 2,
      date: '2025-01-14',
      amount: 50,
      accountFrom: 'Car Loan',
      transactionName: 'Car',
      category: 'Food',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 3,
      date: '2025-01-13',
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
      date: '2025-01-12',
      amount: 250,
      accountFrom: 'Credit Card',
      transactionName: 'Online Shopping',
      category: 'Shopping',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 5,
      date: '2024-12-25',
      amount: 75,
      accountFrom: 'Checking',
      transactionName: 'Restaurant',
      category: 'Food',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 6,
      date: '2024-12-24',
      amount: 1000,
      accountFrom: 'Checking',
      transactionName: 'Freelance Income',
      category: 'Freelance',
      type: 'income',
      currency: 'USD',
    },
    {
      id: 7,
      date: '2024-12-23',
      amount: 300,
      accountFrom: 'Savings',
      transactionName: 'Vacation Savings',
      category: 'Savings',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 8,
      date: '2024-12-22',
      amount: 500,
      accountFrom: 'Credit Card',
      transactionName: 'Holiday Shopping',
      category: 'Shopping',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 9,
      date: '2024-12-21',
      amount: 80,
      accountFrom: 'Checking',
      transactionName: 'Electric Bill',
      category: 'Utilities',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 10,
      date: '2024-12-20',
      amount: 60,
      accountFrom: 'Checking',
      transactionName: 'Internet Bill',
      category: 'Utilities',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 11,
      date: '2024-11-15',
      amount: 40,
      accountFrom: 'Savings',
      transactionName: 'Emergency Fund',
      category: 'Savings',
      type: 'income',
      currency: 'USD',
    },
    {
      id: 12,
      date: '2024-11-14',
      amount: 70,
      accountFrom: 'Checking',
      transactionName: 'Gas',
      category: 'Transport',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 13,
      date: '2024-11-13',
      amount: 150,
      accountFrom: 'Credit Card',
      transactionName: 'Clothing',
      category: 'Shopping',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 14,
      date: '2024-11-12',
      amount: 200,
      accountFrom: 'Checking',
      transactionName: 'Medical Bill',
      category: 'Health',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 15,
      date: '2024-11-11',
      amount: 30,
      accountFrom: 'Checking',
      transactionName: 'Subscription Service',
      category: 'Entertainment',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 16,
      date: '2024-11-10',
      amount: 120,
      accountFrom: 'Checking',
      transactionName: 'Gym Membership',
      category: 'Health',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 17,
      date: '2024-10-10',
      amount: 400,
      accountFrom: 'Savings',
      transactionName: 'Car Maintenance',
      category: 'Transport',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 18,
      date: '2024-10-09',
      amount: 600,
      accountFrom: 'Checking',
      transactionName: 'Rent',
      category: 'Housing',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 19,
      date: '2024-10-08',
      amount: 350,
      accountFrom: 'Credit Card',
      transactionName: 'Furniture',
      category: 'Shopping',
      type: 'expense',
      currency: 'USD',
    },
    {
      id: 20,
      date: '2024-10-07',
      amount: 100,
      accountFrom: 'Checking',
      transactionName: 'Groceries',
      category: 'Food',
      type: 'expense',
      currency: 'USD',
    }
  ];
// Sort transactions descending by date
export  function sortTransactionsByDateDescending(txns) {
    //the argument is an array
    return [...txns].sort((a, b) => new Date(b.date) - new Date(a.date));
    //[...txns] means that we took a copy of that array, we pass things by reference in react, protect the original array and ensure immutability,
    //and the sorting part means that we are sorting them based on the date
    //we transform the transactions string date component into a Date object
    //and we base the comparison of the value of the difference of two Date of two elements
  }
  // Group transactions by month/year from current to oldest
export  function groupTransactionsByMonthFromCurrent (txns) {
    if (!txns || txns.length === 0) {//the !txns part check if it's falsy in general, meaning null empty string false but not empty array
      return [];
    }

    //it is made clear that txns is already sorted, so we get all this information, mainly the span of the months in which transactions are made
    const oldestTransaction = txns[txns.length - 1];
    const oldestDate = new Date(oldestTransaction.date);
    const oldestYear = oldestDate.getFullYear();
    const oldestMonth = oldestDate.getMonth();

    //this gives us the current system date
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();

    //it is segmentation time!
    const results = [];
    //remember we got the span of the months and years, we use this to create the rows for the new array
    //we can decrement with some logic until we hit the last transaction months/year (this included of course)
    while (
      currentYear > oldestYear ||
      (currentYear === oldestYear && currentMonth >= oldestMonth)
    ) {
      const monthlyTransactions = txns.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth
        );
      //this enables us to retreive all the transactions with the specified month and year
      });
      //remember we pushed not only the transaction but also the month and year
      results.push({
        year: currentYear,
        month: currentMonth,
        transactions: monthlyTransactions,
      });
      //decrementation logic
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
    const day = new Date(txn.date).getDate();
    if (!dailyMap[day]) {
      // zero income/expense for each new day
      dailyMap[day] = { date: String(day).padStart(2, '0'), income: 0, expense: 0 };
    }
    if (txn.type === 'income') {
      dailyMap[day].income += txn.amount;
    } else if (txn.type === 'expense') {
      dailyMap[day].expense += txn.amount;
    }
  });

  // Return sorted by day ascending
  return Object.values(dailyMap).sort((a, b) => parseInt(a.date) - parseInt(b.date));
}




//-------------------------------------logic for the monthly switcher---------------
// For the MonthlySwitcher component to display the name of the month and year.
//what does the map exactly do, it just goes through every element in the array, and or every element it created a date object
//avaliable months

//-----------------------------------logic for the form and for the add button-----------------------------
//Handling save for editing and adding
//handle save

//this function when passes the id, it uses the hook and creates an array where it filters out the transaction with the id in question
//handle delete
// Custom hook
export function useTransactions() {

    const [transactions, setTransactions] = useState(dummyTransactions);
  
    // Sort and group transactions
    const sortedTransactions = sortTransactionsByDateDescending(transactions);
    const transactionsGrouped = groupTransactionsByMonthFromCurrent(
      sortedTransactions
    );
  
    // Available months for MonthlySwitcher
    const availableMonths = transactionsGrouped.map((g) => {
      const date = new Date(g.year, g.month, 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    });
  
    // Handle saving (add/edit) transactions
    const handleSave = (updatedTxn) => {
      setTransactions((prev) => {
        if (updatedTxn.id) {
          return prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t));
        } else {
          const newId = Math.max(0, ...prev.map((p) => p.id)) + 1;
          return [...prev, { ...updatedTxn, id: newId }];
        }
      });
    };
  
    // Handle deleting transactions
    const handleDelete = (id) => {
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    };
  
    return {
      transactionsGrouped,
      availableMonths,
      handleSave,
      handleDelete,
      transactions
    };
  }