import './Account.css';

function Account({ accountName, balance, onAccountClick }) {
  return (
    <div className="account-row" onClick={() => onAccountClick(accountName)}>
      <div className="account-titles">
        <span>{accountName}</span>
        <span>{balance}</span>
      </div>
    </div>
  );
}

export default Account;