import './Account.css';

function Account({ accountName, balance, currencySymbol, onAccountClick, onEdit, onDelete }) {
  return (
    <div className="account-row" onClick={() => onAccountClick(accountName)}>
      <div className="account-titles">
        <span>{accountName}</span>
        <span className="account-amount">{balance} {currencySymbol}</span>
      </div>
      <div className="account-actions">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button>
      </div>
    </div>
  );
}

export default Account;