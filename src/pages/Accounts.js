import { useState, useEffect } from 'react';
import { useAccounts, createAccount, updateAccount, deleteAccount } from '../Services/AccountsData';
import Account from '../components/Account';
import AccountDetails from '../components/AccountDetails';
import Modal from '../components/Modal';
import axios from 'axios';
import config from '../Config';
import './Accounts.css';

function Accounts() {
  const userId = 3; // Replace with the actual user ID
  const { groupedAccounts, assets, liabilities, total, loading, error } = useAccounts(userId);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', currency_choice: 'primary', account_type_id: '1' });
  const [editForm, setEditForm] = useState({ name: '' });
  const [currencies, setCurrencies] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);

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

    async function fetchAccountTypes() {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/account_types`);
        setAccountTypes(response.data);
      } catch (err) {
        console.error('Error fetching account types:', err);
      }
    }

    fetchCurrencies();
    fetchAccountTypes();
  }, [userId]);

  async function handleAdd(newAcc) {
    try {
      await createAccount(newAcc);
      window.location.reload();
    } catch (error) {
      console.error('Error creating account:', error.message);
    }
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
                  currencySymbol={acc.currency_symbol}
                  onAccountClick={() => setSelectedAccount(acc.name)}
                  onEdit={() => setEditAcc(acc)}
                  onDelete={() => handleDelete(acc.account_id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="add-account-button" onClick={() => setShowForm(true)}>
        +
      </button>

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
                currency_choice: addForm.currency_choice,
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
              value={addForm.currency_choice}
              onChange={(e) => setAddForm({ ...addForm, currency_choice: e.target.value })}
            >
              <option value="primary">Primary Currency</option>
              <option value="secondary">Secondary Currency</option>
            </select>
            <select
              value={addForm.account_type_id}
              onChange={(e) => setAddForm({ ...addForm, account_type_id: e.target.value })}
            >
              {accountTypes.map((type) => (
                <option key={type.account_type_id} value={type.account_type_id}>
                  {type.account_type_description}
                </option>
              ))}
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