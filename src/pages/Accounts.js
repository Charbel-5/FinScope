// ...existing code...
import { useState } from 'react';
import { useAccounts } from '../Services/AccountsData';
import Account from '../components/Account';
import AccountDetails from '../components/AccountDetails';
import './Accounts.css';

function Accounts() {
  const { groupedAccounts, assets, liabilities, total } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <>
      <div className="accounts-container">
        <div className="accounts-header">
          <h2 className='assets'>Assets: {assets}</h2>
          <h2 className='liabilities'>Liabilities: {liabilities}</h2>
          <h2
          className={`${ total > 0 ? 'assets' : 'liabilities'}`}
          >Total: {total}</h2>
        </div>
        {groupedAccounts.map(([type, accounts]) => (
          <div key={type} className="account-wrapper">
            <div className="account-group-title">{type}</div>
            {accounts.map((acc) => (
              <Account
                key={acc.id}
                accountName={acc.accountName}
                balance={acc.balance}
                onAccountClick={(name) => setSelectedAccount(name)}
              />
            ))}
          </div>
        ))}
      </div>

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