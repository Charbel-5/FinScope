import React, { useState, useEffect } from 'react';
import './TransactionInput.css';

function TransactionInput({ onClose, onSave, initialTransaction }) {
  const [transactionType, setTransactionType] = useState(
    initialTransaction?.transaction_type || 'income'
  );

  const [formData, setFormData] = useState({
    transaction_id: initialTransaction?.transaction_id || null,
    transaction_date: initialTransaction?.transaction_date || '',
    transaction_amount: initialTransaction?.transaction_amount || '',
    from_account: initialTransaction?.from_account || '',
    to_account: initialTransaction?.to_account || '',
    transaction_name: initialTransaction?.transaction_name || '',
    transaction_category: initialTransaction?.transaction_category || '',
    currency: initialTransaction?.currency || 'USD',
  });

  useEffect(() => {
    if (initialTransaction) {
      setTransactionType(initialTransaction.transaction_type);
      setFormData({
        transaction_id: initialTransaction.transaction_id,
        transaction_date: initialTransaction.transaction_date,
        transaction_amount: initialTransaction.transaction_amount,
        from_account: initialTransaction.from_account,
        to_account: initialTransaction.to_account,
        transaction_name: initialTransaction.transaction_name,
        transaction_category: initialTransaction.transaction_category,
        currency: initialTransaction.currency,
      });
    }
  }, [initialTransaction]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      transaction_type: transactionType,
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
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            placeholder="Date"
          />
          <input
            name="transaction_amount"
            value={formData.transaction_amount}
            onChange={handleChange}
            placeholder="Amount"
          />
          <input
            name="transaction_name"
            value={formData.transaction_name}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            name="from_account"
            value={formData.from_account}
            onChange={handleChange}
            placeholder="Account From"
          />
          {transactionType === 'transfer' && (
            <input
              name="to_account"
              value={formData.to_account}
              onChange={handleChange}
              placeholder="Account To"
            />
          )}
          <input
            name="transaction_category"
            value={formData.transaction_category}
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