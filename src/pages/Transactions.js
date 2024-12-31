import { useState } from 'react';
import TransactionBox from "../components/TransactionBox";
import Transaction from "../components/Transaction"; // Import the Transaction component
import MonthlySwitcher from "../components/MonthlySwitcher";


function Transactions(){
    const dummyTransactions = [
        {
          date: '2024-05-02',
          amount: 2500,
          accountFrom: 'Checking',
          transactionName: 'Salary',
          category: 'Salary',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-06-02',
          amount: 50,
          accountFrom: 'Checking',
          transactionName: 'Groceries',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-07-03',
          amount: 100,
          accountFrom: 'Checking',
          accountTo: 'Savings',
          transactionName: 'Transfer to Savings',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-08-04',
          amount: 250,
          accountFrom: 'Credit Card',
          transactionName: 'Online Shopping',
          category: 'Shopping',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2024-09-05',
          amount: 75,
          accountFrom: 'Checking',
          transactionName: 'Restaurant',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-10-06',
          amount: 1000,
          accountFrom: 'Checking',
          transactionName: 'Freelance Income',
          category: 'Freelance',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2024-10-07',
          amount: 120,
          accountFrom: 'Checking',
          transactionName: 'Gas',
          category: 'Transportation',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-08-09',
          amount: 30,
          accountFrom: 'Checking',
          transactionName: 'Bus Pass',
          category: 'Transportation',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-09-09',
          amount: 200,
          accountFrom: 'Savings',
          accountTo: 'Checking',
          transactionName: 'Emergency Transfer',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-02-10',
          amount: 45,
          accountFrom: 'Checking',
          transactionName: 'Movie Tickets',
          category: 'Entertainment',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-11',
          amount: 3000,
          accountFrom: 'Checking',
          transactionName: 'Bonus',
          category: 'Salary',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-09-12',
          amount: 60,
          accountFrom: 'Checking',
          transactionName: 'Utility Bill',
          category: 'Bills',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-13',
          amount: 150,
          accountFrom: 'Credit Card',
          transactionName: 'Clothes',
          category: 'Shopping',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-14',
          amount: 600,
          accountFrom: 'Checking',
          transactionName: 'Rent',
          category: 'Housing',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-06-15',
          amount: 100,
          accountFrom: 'Savings',
          accountTo: 'Brokerage',
          transactionName: 'Investing',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-01-16',
          amount: 220,
          accountFrom: 'Checking',
          transactionName: 'Car Insurance',
          category: 'Bills',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-17',
          amount: 90,
          accountFrom: 'Credit Card',
          transactionName: 'Dining Out',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-08-18',
          amount: 400,
          accountFrom: 'Checking',
          transactionName: 'Part-Time Work',
          category: 'Freelance',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-01-19',
          amount: 60,
          accountFrom: 'Checking',
          transactionName: 'Gym Membership',
          category: 'Fitness',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-20',
          amount: 80,
          accountFrom: 'Checking',
          transactionName: 'Haircut',
          category: 'Personal Care',
          type: 'expense',
          currency: 'USD'
        }
    ];
    function sortTransactionsByDateDescending(transactions) {
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function groupTransactionsByMonthFromCurrent(transactions) {
      if (!transactions || transactions.length === 0) {
        return [];
      }
      
      // 1. Identify the earliest (oldest) transaction date.
      //    Since `transactions` is sorted DESC, the last element is the oldest.
      const oldestTransaction = transactions[transactions.length - 1];
      const oldestDate = new Date(oldestTransaction.date);
      const oldestYear = oldestDate.getFullYear();
      const oldestMonth = oldestDate.getMonth(); // 0-based

      // 2. Get the current system year and month (0-based).
      const now = new Date();
      let currentYear = now.getFullYear();
      let currentMonth = now.getMonth();

      const results = [];

      // 3. Loop from the current (year, month) down to the (oldestYear, oldestMonth).
      //    At each step, gather that month's transactions OR push null if none.
      while (
        currentYear > oldestYear ||
        (currentYear === oldestYear && currentMonth >= oldestMonth)
      ) {
        // Gather transactions for this (year, month).
        const monthlyTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.date);
          return (
            txDate.getFullYear() === currentYear &&
            txDate.getMonth() === currentMonth
          );
        });

        // If no transactions for the current month, push null; otherwise, push the array.
        if (monthlyTransactions.length === 0) {
          results.push(null);
        } else {
          results.push(monthlyTransactions);
        }

        // Decrement the month
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11; // December
          currentYear--;
        }
      }

      return results;
    }


    const sortedTransactions = sortTransactionsByDateDescending(dummyTransactions);
    const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);

    console.log(transactionsGrouped);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
      if (currentIndex < transactionsGrouped.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handleNext = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    const currentMonthTransactions = transactionsGrouped[currentIndex] || [];

    const getMonthYearLabel = (index) => {
      const group = transactionsGrouped[index];
      if (!group || group.length === 0) return 'No Data';
      const date = new Date(group[0].date);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    return (
      <>
        <MonthlySwitcher
          displayMonthYear={getMonthYearLabel(currentIndex)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        <div>
          {currentMonthTransactions.map((txn, idx) => (
            <TransactionBox key={idx}>
              <Transaction
                date={txn.date}
                amount={txn.amount}
                accountFrom={txn.accountFrom}
                accountTo={txn.accountTo}
                transactionName={txn.transactionName}
                category={txn.category}
                type={txn.type}
                currency={txn.currency}
              />
            </TransactionBox>
          ))}
        </div>
      </>
    );
}

export default Transactions;