import { useState } from 'react'; //we imported react hook to manage componenet state
import TransactionBox from '../components/TransactionBox';
import Transaction from '../components/Transaction';
import MonthlySwitcher from '../components/MonthlySwitcher';
import TransactionInput from '../components/TransactionInput';

//const nameofthefile() 
function Transactions() {
  // we created a dummy array of transactions, in this case the ids are ordered (later down the line they will become unordered)
  const dummyTransactions = [
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
      accountFrom: 'Checking',
      transactionName: 'Groceries',
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

  //--------- Segmenting the data and sorting it ------------------------------------------------//


  // Sort transactions descending by date
  function sortTransactionsByDateDescending(txns) {
    //the argument is an array
    return [...txns].sort((a, b) => new Date(b.date) - new Date(a.date));
    //[...txns] means that we took a copy of that array, we pass things by reference in react, protect the original array and ensure immutability,
    //and the sorting part means that we are sorting them based on the date
    //we transform the transactions string date component into a Date object
    //and we base the comparison of the value of the difference of two Date of two elements
  }

  // Group transactions by month/year from current to oldest
  function groupTransactionsByMonthFromCurrent (txns) {
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

  //remember states are used to tell us when react should rerender stuff and what to rerender
  const [transactions, setTransactions] = useState(dummyTransactions);

  const sortedTransactions = sortTransactionsByDateDescending(transactions); //we sorted the transaction relative to their date
  const transactionsGrouped = groupTransactionsByMonthFromCurrent(sortedTransactions);//and then we partitioned them relative to their month/year




  //-------------------------------------logic for the monthly switcher---------------

  // For the MonthlySwitcher component to display the name of the month and year.
  //what does the map exactly do, it just goes through every element in the array, and or every element it created a date object
  const availableMonths = transactionsGrouped.map((g) => {
    const date = new Date(g.year, g.month, 1);
    //here it is transforming the Date into strings in a formatted way we get the December 2024
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  // Manage which month's index is displayed
  //index used for tracking where we are in the month/year
  const [currentIndex, setCurrentIndex] = useState(0);

  //so it makes sense for previous to increment the index
  //the important thing here is the condition that limits how much we can increment
  const handlePrevious = () => {
    if (currentIndex < transactionsGrouped.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  //same idea here
  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  //when we select a month we pass down it's index in order to change the current index to it's index
  const handleSelectMonth = (index) => {
    setCurrentIndex(index);
  };

  //this is a way to get the relevant transactions inside an array with the index
  //remember everytime we change the currentIndex currentMonthTransactions changes too and react rerenders it
  const currentGroup = transactionsGrouped[currentIndex] || {};
  const currentMonthTransactions = currentGroup.transactions || [];


  //we want to get the monthyear label with the index
  const getMonthYearLabel = (index) => {
    const group = transactionsGrouped[index];
    if (!group) return '';
    const { year, month } = group;
    const date = new Date(year, month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  //--------- we are now working with edit/delete component--------//
  //we initialize hook states, one to show the form and the other to see if there is data to use as default (when we want to edit)
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  //this function when passes the id, it uses the hook and creates an array where it filters out the transaction with the id in question
  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  //when we press edit, we pass all the transaction object
  //we update the hooks one will take the whole transaction object and stores, the other will just show the form
  const handleEdit = (txn) => {
    setEditData(txn);  // store existing transaction in state
    setShowForm(true);
  };

  //Handling save for editing and adding
  const handleSave = (updatedTxn) => {
    setTransactions((prev) => {
      //so if the newly added object has an id we do that
      if (updatedTxn.id) {
        //basically just overriding the old object
        return prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t));
      } else {
        // Otherwise, it's a new transaction -> give it a unique ID
        // this will be done assigned by the back-end later on
        const newId = Math.max(0, ...prev.map((p) => p.id)) + 1;
        return [...prev, { ...updatedTxn, id: newId }];
      }
    });
  };
  //----------- Finito with the functions -------//


  //------------How things interconnect nicely together to create the dynamic react page----------//
  //the important thing is to look at what data each component is taking
  //and the other important thing is to see if that data is impacted by hooks
  //because if it is it will be recalculated and react will rerender the component with the data that has been changed using the hook
  //things are very interconnected a change in INDEX will result to changes in currentmonthTransactions and getMonthyearLabel will be recalled
  //a change in transactions will result in changes in currentmonthTransactions and availableMonths
  return (
    <>
      <MonthlySwitcher
        displayMonthYear={getMonthYearLabel(currentIndex)} //get the current month year
        onPrevious={handlePrevious} //a function to increment using a hook the index
        onNext={handleNext} //a function to increment using a hook the index
        availableMonths={availableMonths} //an array of all the available months
        onSelectMonth={handleSelectMonth} //a function to change the index to a specified one using the hook
        //the button besides this is just the add button, and onclick it just showcases the form using the hook
      />

      <button style={{ float: 'right' }} onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <TransactionInput
          //we are passing both showform and seteditdata functions to the TransactionInput
          //we should set the edit data to null on close or else when we close it the edit of an old transaction will persist if we try to add
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          //when we save inside it we call this function that will change the settransaction which means the transaction will change
          onSave={handleSave}
          // Pass the transaction data if editing; null if creating new
          initialTransaction={editData}
          //this is only for the form, we can get to this by either add or edit
        />
      )}

      
      <div>
        {currentMonthTransactions.map((txn) => (
          <TransactionBox key={txn.id}>
            <Transaction
              //remember everytime we change the current index currentMonthTransactions changes and thus this gets rerendered
              date={txn.date}
              amount={txn.amount}
              accountFrom={txn.accountFrom}
              accountTo={txn.accountTo}
              transactionName={txn.transactionName}
              category={txn.category}
              type={txn.type}
              currency={txn.currency}
              //we will focus only on the last two
              //for every transaction we have a txn and a txn.id where we will use the edit and delete function that call hooks
              onEdit={() => handleEdit(txn)}
              //on delete it changes the transactions using a hook
              //changed transactions implies change in sortedtransaction implies change in groupedtransactions implies change current group and then change in currentmonthtransaction
              onDelete={() => handleDelete(txn.id)}
            />
          </TransactionBox>
        ))}
      </div>
    </>
  );
}

export default Transactions;
