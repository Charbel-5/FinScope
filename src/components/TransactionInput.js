import React, { useState } from 'react';
import './TransactionInput.css';

function TransactionInput({ onClose,  onSave, initialTransaction }) {
  const [transactionType, setTransactionType] = useState(initialTransaction?.type || 'income');
  const [formData, setFormData] = useState({
    date: initialTransaction?.date || '',
    amount: initialTransaction?.amount || '',
    accountFrom: initialTransaction?.accountFrom || '',
    accountTo: initialTransaction?.accountTo || '',
    transactionName: initialTransaction?.transactionName || '',
    category: initialTransaction?.category || '',
    currency: initialTransaction?.currency || 'USD',
    index: initialTransaction?.index
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, type: transactionType });
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

        <form onSubmit={handleSubmit}>
        <input name="date" value={formData.date} onChange={handleChange} />
        <input name="amount" value={formData.amount} onChange={handleChange} />
        <input name="transactionName" value={formData.transactionName} onChange={handleChange} />
        <input name="accountFrom" value={formData.accountFrom} onChange={handleChange} />
        {transactionType === 'transfer' && (
          <input name="accountTo" value={formData.accountTo} onChange={handleChange} />
        )}
        <input name="category" value={formData.category} onChange={handleChange} />
        <input name="currency" value={formData.currency} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      </div>
    </div>
  );
}

export default TransactionInput;