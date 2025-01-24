import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
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
  const [errors, setErrors] = useState({});

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

  // Add new useEffect to reset category when type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      transaction_category: initialTransaction?.transaction_type === transactionType 
        ? initialTransaction?.transaction_category 
        : ''
    }));
  }, [transactionType, initialTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for the field being changed
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Special handling for amount field
    if (name === 'transaction_amount') {
      // Convert to number and ensure it's positive
      const numValue = Math.abs(parseFloat(value));
      setFormData(prev => ({
        ...prev,
        [name]: numValue || '' // Use empty string if NaN
      }));
      return;
    }
  
    // Normal handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (validator.isEmpty(formData.transaction_date)) {
      newErrors.transaction_date = 'Date is required';
    }

    // Amount validation
    if (!formData.transaction_amount || formData.transaction_amount <= 0) {
      newErrors.transaction_amount = 'Please enter a valid positive amount';
    }

    // From account validation
    if (validator.isEmpty(formData.from_account)) {
      newErrors.from_account = 'Please select an account';
    }

    // To account validation for transfers
    if (transactionType === 'Transfer') {
      if (validator.isEmpty(formData.to_account)) {
        newErrors.to_account = 'Please select a destination account';
      }
      if (formData.from_account === formData.to_account) {
        newErrors.to_account = 'Source and destination accounts must be different';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Set default category if none selected
    const submissionData = {
      ...formData,
      transaction_type: transactionType,
      transaction_category: formData.transaction_category || 'Other'
    };

    onSave(submissionData);
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
          <div className="form-group">
            <input
              type="date"
              name="transaction_date"
              max={new Date().toISOString().split('T')[0]}
              value={formData.transaction_date}
              onChange={handleChange}
            />
            {errors.transaction_date && (
              <div className="error-message">
                {errors.transaction_date}
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              name="transaction_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.transaction_amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            {errors.transaction_amount && (
              <div className="error-message">
                {errors.transaction_amount}
              </div>
            )}
          </div>

          <input
            name="transaction_name"
            value={formData.transaction_name}
            onChange={handleChange}
            placeholder="Description"
          />
          <div className="form-group">
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
            <div className={`error-message ${errors.from_account ? 'visible' : ''}`}>
              {errors.from_account}
            </div>
          </div>
          {transactionType === 'Transfer' && (
            <div className="form-group">
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
              <div className={`error-message ${errors.to_account ? 'visible' : ''}`}>
                {errors.to_account}
              </div>
            </div>
          )}
          {transactionType !== 'Transfer' && (
            <div className="form-group">
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
            </div>
              
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