import React, { useState } from 'react';
import './TransactionInput.css';

function TransactionInput({ onClose, onSave, initialTransaction }) {
  const [transactionType, setTransactionType] = useState(
    initialTransaction?.type || 'income'
  );

  // IMPORTANT: Include `id` in your formData if it exists
  const [formData, setFormData] = useState({
    id: initialTransaction?.id || null,
    date: initialTransaction?.date || '',
    amount: initialTransaction?.amount || '',
    accountFrom: initialTransaction?.accountFrom || '',
    accountTo: initialTransaction?.accountTo || '',
    transactionName: initialTransaction?.transactionName || '',
    category: initialTransaction?.category || '',
    currency: initialTransaction?.currency || 'USD',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the updated transaction (including id) to onSave
    onSave({
      ...formData,
      type: transactionType, // override the type from toggle
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="switches">
          <button
            className={transactionType === 'income' ? 'active' : ''}
            onClick={() => setTransactionType('income')}
            type="button"
          >
            Income
          </button>
          <button
            className={transactionType === 'expense' ? 'active' : ''}
            onClick={() => setTransactionType('expense')}
            type="button"
          >
            Expense
          </button>
          <button
            className={transactionType === 'transfer' ? 'active' : ''}
            onClick={() => setTransactionType('transfer')}
            type="button"
          >
            Transfer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="Date"
          />
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
          />
          <input
            name="transactionName"
            value={formData.transactionName}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            name="accountFrom"
            value={formData.accountFrom}
            onChange={handleChange}
            placeholder="Account From"
          />

          {transactionType === 'transfer' && (
            <input
              name="accountTo"
              value={formData.accountTo}
              onChange={handleChange}
              placeholder="Account To"
            />
          )}

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <input
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            placeholder="Currency"
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TransactionInput;
