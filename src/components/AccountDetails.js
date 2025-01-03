import React, { useState } from 'react';
import './AccountDetails.css';
import TransactionBox from './TransactionBox';
import Transaction from './Transaction';
import TransactionInput from './TransactionInput.js';
import { useTransactions } from '../Services/TransactionsData';


// Helper to filter transactions for a specific account
function getAccountTransactions(transactions, accountName) {
  return transactions.filter((txn) => {
    if (txn.type === 'income' || txn.type === 'expense') {
      return txn.accountFrom === accountName;
    }
    // For transfers, check both 'accountFrom' & 'accountTo'
    return txn.accountFrom === accountName || txn.accountTo === accountName;
  });
}

function AccountDetails({ accountName, onClose }) {
  // Always call your custom hook at the top
  const { transactionsGrouped, availableMonths, handleSave, handleDelete,transactions } = useTransactions();

  // Always call useState at the top level
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // If accountName is falsy, return early AFTER hooks are called
  if (!accountName) return null;

  // If you want to edit a transaction, set up the data and open the form
  const handleEdit = (txn) => {
    setEditData(txn);
    setShowForm(true);
  };

  // Filter out the transactions for this specific account
  const filteredTransactions = getAccountTransactions(transactions, accountName);

  return (
    <div className="account-details-backdrop" onClick={onClose}>
      <div className="account-details-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Transactions for {accountName}</h2>

        <div className="account-details-content">
          {filteredTransactions.map((txn) => (
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
      </div>

      {/* Only render the form if showForm is true */}
      {showForm && (
        <TransactionInput
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSave}
          initialTransaction={editData}
        />
      )}
    </div>
  );
}

export default AccountDetails;

 