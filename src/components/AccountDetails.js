import React from 'react';
import './AccountDetails.css';
import TransactionBox from './TransactionBox';
import Transaction from './Transaction';

import { useTransactions } from '../Services/TransactionsData';

  
function getAccountTransactions(transactions, accountName) {
  return transactions.filter((txn) => {
    if (txn.type === 'income' || txn.type === 'expense') {
      return txn.accountFrom === accountName;
    }
    // transfer
    return txn.accountFrom === accountName || txn.accountTo === accountName;
  });
}

function AccountDetails({ accountName, onClose }) {
  if (!accountName) return null;

  const { handleSave, handleDelete } = useTransactions();

  const filteredTransactions = getAccountTransactions(dummyTransactions, accountName);

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
      </div>
    </div>
  );
}

export default AccountDetails;