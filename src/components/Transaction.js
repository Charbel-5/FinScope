import './Transaction.css';

function Transaction({
  date,
  amount,
  accountFrom,
  accountTo,
  transactionName,
  category,
  type,
  currency
}) {
  return (
    <div className="transaction">
      <div className="transaction-details">
        <div className="transaction-name">{transactionName}</div>
        <div className="transaction-meta">
          <span>{date}</span> | <span>{type}</span>
        </div>
        {type === 'transfer' && (
          <div className="transaction-accounts">
            From: {accountFrom} &rarr; To: {accountTo}
          </div>
        )}
        {type !== 'transfer' && (
          <div className="transaction-accounts">
            Account: {accountFrom}
            | <span>{category}</span>
          </div>
        )}
      </div>
      <div className="transaction-amount">
        {amount} {currency}
      </div>
    </div>
  );
}

export default Transaction;