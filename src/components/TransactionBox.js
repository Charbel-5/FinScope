import './TransactionBox.css';

function TransactionBox( props) {
  return (
    <div className="transaction-box">
      {props.children}
    </div>
  );
}

export default TransactionBox;