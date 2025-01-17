import { useState, useEffect } from 'react';
import { useAccounts, createAccount, updateAccount, deleteAccount } from '../Services/AccountsData';
import Account from '../components/Account';
import AccountDetails from '../components/AccountDetails';
import Modal from '../components/Modal';
import axios from 'axios';
import config from '../Config';
import './Accounts.css';

function Accounts() {
  const userId = 1; // Replace with the actual user ID
  const { groupedAccounts, assets, liabilities, total, loading, error } = useAccounts(userId);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', currency_id: '', account_type_id: '1' });
  const [editForm, setEditForm] = useState({ name: '' });
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/users/${userId}/currencies`);
        const data = response.data;
        if (data.primary_currency && data.secondary_currency) {
          setCurrencies([
            { currency_id: 1, currency_name: data.primary_currency },
            { currency_id: 2, currency_name: data.secondary_currency }
          ]);
          setAddForm((prev) => ({
            ...prev,
            currency_id: 1 // Default to primary currency
          }));
        }
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    }
    fetchCurrencies();
  }, [userId]);

  async function handleAdd(newAcc) {
    await createAccount(newAcc);
    window.location.reload();
  }

  async function handleUpdate(acc) {
    await updateAccount(acc.account_id, acc);
    window.location.reload();
  }

  async function handleDelete(id) {
    await deleteAccount(id);
    window.location.reload();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading accounts: {error.message}</div>;
  }

  return (
    <>
      <button onClick={() => setShowForm(true)}>Add Account</button>
      <div className="accounts-container">
        <div className="accounts-header">
          <h2 className='assets'>Assets: {assets}</h2>
          <h2 className='liabilities'>Liabilities: {liabilities}</h2>
          <h2 className={`${total > 0 ? 'assets' : 'liabilities'}`}>Total: {total}</h2>
        </div>
        {groupedAccounts.map(([type, accounts]) => (
          <div key={type} className="account-wrapper">
            <div className="account-group-title">{type}</div>
            {accounts.map((acc) => (
              <div key={acc.account_id} className="account-item">
                <Account
                  accountName={acc.name}
                  balance={acc.total_amount}
                  onAccountClick={() => setSelectedAccount(acc.name)}
                />
                <button onClick={() => setEditAcc(acc)}>Edit</button>
                <button onClick={() => handleDelete(acc.account_id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h2>Add Account</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd({
                name: addForm.name,
                total_amount: 0,
                account_type_id: parseInt(addForm.account_type_id),
                user_id: userId,
                currency_id: parseInt(addForm.currency_id),
              });
            }}
          >
            <input
              type="text"
              placeholder="Account Name"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            />
            <select
              value={addForm.currency_id}
              onChange={(e) => setAddForm({ ...addForm, currency_id: e.target.value })}
            >
              {currencies.map((currency) => (
                <option key={currency.currency_id} value={currency.currency_id}>
                  {currency.currency_name}
                </option>
              ))}
            </select>
            <select
              value={addForm.account_type_id}
              onChange={(e) => setAddForm({ ...addForm, account_type_id: e.target.value })}
            >
              <option value="1">Checking</option>
              <option value="2">Credit Card</option>
              <option value="3">Savings</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </Modal>
      )}

      {editAcc && (
        <Modal onClose={() => setEditAcc(null)}>
          <h2>Edit Account</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate({ ...editAcc, name: editForm.name });
            }}
          >
            <input
              type="text"
              placeholder="Account Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditAcc(null)}>Cancel</button>
          </form>
        </Modal>
      )}

      {selectedAccount && (
        <AccountDetails
          accountName={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </>
  );
}

export default Accounts;