// ...existing code...
function Account({ accountName, balance, onAccountClick }) {
    return (
      <div className="account-row" onClick={() => onAccountClick(accountName)}>
        <span className="account-name">{accountName}</span>
        <span className="account-balance">{balance}</span>
      </div>
    );
  }
  
  export default Account;