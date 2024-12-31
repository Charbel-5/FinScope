import React, { useState } from 'react';
import './TransactionInput.css';

function TransactionInput({ onClose }) {
    const [transactionType, setTransactionType] = useState('income');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted');
        onClose();
    };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="switches">
          <button
            className={transactionType === 'income' ? 'active' : ''}
            onClick={() => setTransactionType('income')}
          >
            Income
          </button>
          <button
            className={transactionType === 'expense' ? 'active' : ''}
            onClick={() => setTransactionType('expense')}
          >
            Expense
          </button>
          <button
            className={transactionType === 'transfer' ? 'active' : ''}
            onClick={() => setTransactionType('transfer')}
          >
            Transfer
          </button>
        </div>

        {transactionType === 'income' && (
          <form onSubmit={handleSubmit}>
            <input placeholder="Date" />
            <input placeholder="Amount" />
            <input placeholder="Name" />
            <input placeholder="Account From" />
            <input placeholder="Category" />
            <input placeholder="Currency" />
            <button type="submit">Submit</button>
          </form>
        )}

        {transactionType === 'expense' && (
          <form onSubmit={handleSubmit}>
            <input placeholder="Date" />
            <input placeholder="Amount" />
            <input placeholder="Name" />
            <input placeholder="Account From" />
            <input placeholder="Category" />
            <input placeholder="Currency" />
            <button type="submit">Submit</button>
          </form>
        )}

        {transactionType === 'transfer' && (
          <form onSubmit={handleSubmit}>
            <input placeholder="Date" />
            <input placeholder="Amount" />
            <input placeholder="Name" />
            <input placeholder="Account From" />
            <input placeholder="Account To" />
            <input placeholder="Category" />
            <input placeholder="Currency" />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TransactionInput;