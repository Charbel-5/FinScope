// ...existing code...
import { useAccounts } from '../Services/AccountsData';
import Account from '../components/Account';

function Accounts() {
  const { groupedAccounts, assets, liabilities, total } = useAccounts();

  return (
    <>
      <style>{`
        .accounts-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 6px;
        }
        .accounts-header {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }
        .account-wrapper {
          margin-bottom: 20px;
        }
        .account-group-title {
          font-size: 1.2rem;
          margin-bottom: 8px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
        }
      `}</style>

      <div className="accounts-container">
        <div className="accounts-header">
          <h2>Assets: {assets}</h2>
          <h2>Liabilities: {liabilities}</h2>
          <h2>Total: {total}</h2>
        </div>
        {groupedAccounts.map(([type, accounts]) => (
          <div key={type} className="account-wrapper">
            <div className="account-group-title">{type}</div>
            {accounts.map((acc) => (
              <Account
                key={acc.id}
                accountName={acc.accountName}
                balance={acc.balance}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Accounts;