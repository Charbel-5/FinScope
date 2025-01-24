import './Transaction.css';

function Transaction({
  date,
  amount,
  accountFrom,
  accountTo,
  transactionName,
  category,
  type,
  currency,
  onEdit, 
  onDelete
}) {
  // Add dynamic class based on transaction type
  return (
    <div className={`transaction ${type}`}>  {/* Add type as a class */}
      <div className="transaction-details">
        <div className="transaction-name">{transactionName}</div>
        <div className="transaction-meta">
          <span>{date}</span> | <span className={`type ${type}`}>{type}</span>
        </div>
        {type === 'Transfer' && (
          <div className="transaction-accounts">
            From: {accountFrom} &rarr; To: {accountTo}
          </div>
        )}
        {type !== 'Transfer' && (
          <div className="transaction-accounts">
            Account: {accountFrom}
            | <span>{category}</span>
          </div>
        )}
      </div>
      <div className={`transaction-amount amount ${type}`}>
        {amount} {currency}
      </div>
      <div className="transaction-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default Transaction;