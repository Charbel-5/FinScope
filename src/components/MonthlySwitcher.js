import React, { useState } from 'react';
import './MonthlySwitcher.css';
import TransactionBox from './TransactionBox';
import Transaction from './Transaction';

function MonthlySwitcher({ transactionsGrouped }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (currentIndex < transactionsGrouped.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentMonthTransactions = transactionsGrouped[currentIndex] || [];

  return (
    <div className="monthly-switcher">
      <button onClick={handlePrevious}>&lt;</button>
      <div className="transactions-container">
        {currentMonthTransactions.map((txn, idx) => (
          <TransactionBox key={idx}>
            <Transaction
              date={txn.date}
              amount={txn.amount}
              accountFrom={txn.accountFrom}
              accountTo={txn.accountTo}
              transactionName={txn.transactionName}
              category={txn.category}
              type={txn.type}
              currency={txn.currency}
            />
          </TransactionBox>
        ))}
      </div>
      <button onClick={handleNext}>&gt;</button>
    </div>
  );
}

export default MonthlySwitcher;