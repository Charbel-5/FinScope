import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionInput.css';
import { useAuth } from '../context/AuthContext';

function TransactionInput({ onClose, onSave, initialTransaction }) {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState(
    initialTransaction?.transaction_type || 'Income'
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

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');

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

  useEffect(() => {
    // Fetch user accounts
    async function fetchAccounts() {
      try {
        const res = await axios.get(`/api/accounts/${user?.userId}`);
        setAccounts(res.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    }

    if (user?.userId) {
      fetchAccounts();
    }
  }, [user?.userId]);

  useEffect(() => {
    // Fetch categories by transaction type
    async function fetchCategories() {
      try {
        const res = await axios.get(`/api/transaction_categories`); 
        // Filter them if needed for type
        const typeLower = transactionType.toLowerCase();
        const filtered = res.data.filter(cat => {
          if (typeLower === 'income') return cat.transaction_type_id === 1; // example
          if (typeLower === 'expense') return cat.transaction_type_id === 2;
          if (typeLower === 'transfer') return cat.transaction_type_id === 3;
          return false;
        });
        setCategories(filtered);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, [transactionType]);

  useEffect(() => {
    // Fetch currency of from_account
    async function fetchCurrency() {
      try {
        if (formData.from_account && user?.userId) {
          const res = await axios.get(`/api/accounts/${user.userId}/currencySymbol/${formData.from_account}`);
          setCurrencySymbol(res.data.currency_symbol || '');
          setFormData(prev => ({ ...prev, currency: res.data.currency_symbol || '' }));
        }
      } catch (err) {
        console.error('Error fetching currency:', err);
      }
    }
    fetchCurrency();
  }, [formData.from_account, user?.userId]);

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
            className={transactionType === 'Income' ? 'active' : ''}
            onClick={() => setTransactionType('Income')}
            type="button"
          >
            Income
          </button>
          <button
            className={transactionType === 'Expense' ? 'active' : ''}
            onClick={() => setTransactionType('Expense')}
            type="button"
          >
            Expense
          </button>
          <button
            className={transactionType === 'Transfer' ? 'active' : ''}
            onClick={() => setTransactionType('Transfer')}
            type="button"
          >
            Transfer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="transaction_date"
            max={new Date().toISOString().split('T')[0]}
            value={formData.transaction_date}
            onChange={handleChange}
          />
          <input
            name="transaction_amount"
            type="number"
            step="0.01"
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
          <select
            name="from_account"
            value={formData.from_account}
            onChange={handleChange}
          >
            <option value="">Select From Account</option>
            {accounts.map(acc => (
              <option key={acc.account_id} value={acc.name}>{acc.name}</option>
            ))}
          </select>
          {transactionType === 'Transfer' && (
            <select
              name="to_account"
              value={formData.to_account}
              onChange={handleChange}
            >
              <option value="">Select To Account</option>
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.name}>{acc.name}</option>
              ))}
            </select>
          )}
          {transactionType !== 'Transfer' && (
              <select
              name="transaction_category"
              value={formData.transaction_category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.transaction_category_id} value={cat.transaction_category_de}>
                  {cat.transaction_category_de}
                </option>
              ))}
            </select>
          )

          }
          
          <input
            name="currency"
            value={formData.currency}
            readOnly
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TransactionInput;