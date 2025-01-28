import { useState, useEffect } from 'react'; //we imported react hook to manage componenet state
import TransactionBox from '../components/TransactionBox';
import Transaction from '../components/Transaction';
import MonthlySwitcher from '../components/MonthlySwitcher';
import TransactionInput from '../components/TransactionInput';
import { useTransactions } from '../context/TransactionsContext';
import './Transactions.css';

//const nameofthefile() 
function Transactions() {

  const { transactions, transactionsGrouped, availableMonths, handleSave, handleDelete } =
    useTransactions();

  // Get current system month/year for empty state
  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  //-------------------------------------logic for the monthly switcher---------------

  // Manage which month's index is displayed
  //index used for tracking where we are in the month/year
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add effect to reset index when transactions group becomes empty
  useEffect(() => {
    if (transactionsGrouped.length === 0 || currentIndex >= transactionsGrouped.length) {
      setCurrentIndex(0);
    }
  }, [transactionsGrouped.length, currentIndex]);

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
  // Update getMonthYearLabel to handle empty state
  const getMonthYearLabel = (index) => {
    if (transactionsGrouped.length === 0) {
      return getCurrentMonthYear();
    }
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


  //when we press edit, we pass all the transaction object
  //we update the hooks one will take the whole transaction object and stores, the other will just show the form
  const handleEdit = (txn) => {
    setEditData(txn);  // store existing transaction in state
    setShowForm(true);
  };

  // Modify handleDelete to wrap the context's handleDelete
  const handleTransactionDelete = async (id) => {
    await handleDelete(id);
    // If after deletion there are no more transactions in current month,
    // and we're not at index 0, reset to most recent month
    if (currentGroup.transactions?.length <= 1 && currentIndex !== 0) {
      setCurrentIndex(0);
    }
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

      <button className="add-transaction-button" onClick={() => setShowForm(true)}>
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
        {currentMonthTransactions.length === 0 ? (
          <div className="no-transactions-message">
            No transactions added yet
          </div>
        ) : (
          currentMonthTransactions.map((txn) => (
            <TransactionBox key={txn.transaction_id}>
              <Transaction
                date={txn.transaction_date}
                amount={txn.transaction_amount}
                accountFrom={txn.from_account}
                accountTo={txn.to_account}
                transactionName={txn.transaction_name}
                category={txn.transaction_category}
                type={txn.transaction_type}
                currency={txn.currency_symbol}
                onEdit={() => handleEdit(txn)}
                onDelete={() => handleTransactionDelete(txn.transaction_id)}
              />
            </TransactionBox>
          ))
        )}
      </div>
    </>
  );
}

export default Transactions;
