import { useState, useEffect } from 'react';
import { useAccounts, createAccount, updateAccount, deleteAccount } from '../Services/AccountsData';
import Account from '../components/Account';
import AccountDetails from '../components/AccountDetails';
import Modal from '../components/Modal';
import axios from 'axios';
import config from '../Config';
import './Accounts.css';
import { useAuth } from '../context/AuthContext';
import { AlertModal } from '../components/AlertModal';

function Accounts() {
  const { user } = useAuth();
  const { groupedAccounts, assets, liabilities, total, loading, error, primaryCurrencySymbol, refreshAccounts } = useAccounts(user?.userId);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', currency_choice: 'primary', account_type_id: '1' });
  const [editForm, setEditForm] = useState({ name: '' });
  const [currencies, setCurrencies] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [addFormError, setAddFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const userAttrsRes = await axios.get(`${config.apiBaseUrl}/api/complex/userAttributes/${user?.userId}`);
        const data = userAttrsRes.data;
        
        console.log('User attributes data:', data);

        const currencies = [
          {
            name: 'primary',
            displayName: `Primary (${data.primary_currency_symbol})`,
            symbol: data.primary_currency_symbol
          }
        ];

        // Add secondary currency if it exists
        if (data.secondary_currency) {
          currencies.push({
            name: 'secondary',
            displayName: `Secondary (${data.secondary_currency})`, // Use currency name if symbol not available
            symbol: data.secondary_currency
          });
        }

        console.log('Processed currencies:', currencies);
        setCurrencies(currencies);
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

    if (user?.userId) {
      fetchCurrencies();
      fetchAccountTypes();
    }
  }, [user?.userId]);

  async function handleAdd(newAcc) {
    // Validate account name
    const accountName = newAcc.name.trim();
    if (!accountName) {
      setAddFormError('Account name cannot be empty or contain only spaces.');
      return;
    }

    try {
      await createAccount({
        ...newAcc,
        name: accountName, // Use trimmed name
        user_id: user?.userId
      });
      setAddFormError(''); // Clear error on success
      window.location.reload();
    } catch (error) {
      console.error('Error creating account:', error.message);
      setAddFormError('Error creating account. Please try again.');
    }
  }

  async function handleUpdate(acc) {
    await updateAccount(acc.account_id, acc);
    window.location.reload();
  }

  async function handleDelete(id) {
    if (!showDeleteConfirm) {
      setAccountToDelete(id);
      setShowDeleteConfirm(true);
      return;
    }
    
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
          <h2 className='assets'>Assets: {assets.toFixed(2)} {primaryCurrencySymbol}</h2>
          <h2 className='liabilities'>Liabilities: {liabilities.toFixed(2)} {primaryCurrencySymbol}</h2>
          <h2 className={`${total > 0 ? 'assets' : 'liabilities'}`}>Total: {total.toFixed(2)} {primaryCurrencySymbol}</h2>
        </div>
        
        {groupedAccounts.length === 0 ? (
          <div className="no-accounts-container">
            <div className="no-accounts-message">
              No accounts yet. Click the + button to add your first account.
            </div>
          </div>
        ) : (
          groupedAccounts.map(([type, accounts]) => (
            <div key={type} className="account-wrapper">
              <div className="account-group-title">{type}</div>
              {accounts.map((acc) => (
                <div key={acc.account_id} className="account-item">
                  <Account
                    accountName={acc.name}
                    balance={acc.total_amount}
                    currencySymbol={acc.currency_symbol}
                    onAccountClick={() => setSelectedAccount(acc.name)}
                    onEdit={() => {
                      setEditAcc(acc);
                      setEditForm({ name: acc.name }); // Initialize editForm with current name
                    }}
                    onDelete={() => handleDelete(acc.account_id)}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <button className="add-account-button" onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <Modal onClose={() => {
          setShowForm(false);
          setAddFormError(''); // Clear error when closing modal
        }}>
          <h2>Add Account</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd({
                name: addForm.name,
                total_amount: 0,
                account_type_id: parseInt(addForm.account_type_id),
                user_id: user?.userId,
                currency_choice: addForm.currency_choice,
              });
            }}
          >
            <input
              type="text"
              placeholder="Account Name"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              required
            />
            
            <select
              value={addForm.currency_choice}
              onChange={(e) => setAddForm({ ...addForm, currency_choice: e.target.value })}
            >
              {currencies.map(currency => (
                <option key={currency.name} value={currency.name}>
                  {currency.displayName}
                </option>
              ))}
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
            {addFormError && <div className="error">{addFormError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditAcc(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {selectedAccount && (
        <AccountDetails
          accountName={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onTransactionChange={refreshAccounts}
        />
      )}

      {showDeleteConfirm && (
        <AlertModal
          message="Deleting this account will also delete all associated transactions. Are you sure you want to continue?"
          type="warning"
          onClose={() => {
            setShowDeleteConfirm(false);
            setAccountToDelete(null);
          }}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDelete(accountToDelete);
          }}
          showConfirmButton={true}
        />
      )}
    </>
  );
}

export default Accounts;