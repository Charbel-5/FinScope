// ...existing code...
import React from 'react';

function StockList({ data }) {
  return (
    <div>
      <h3>Holdings</h3>
      {data.map((h, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', margin: '8px 0', padding: '8px' }}>
          <div>Ticker: {h.ticker}</div>
          <div>Quantity: {h.quantity}</div>
          <div>Price: {h.price}</div>
          <div>Total: {h.totalValue}</div>
        </div>
      ))}
    </div>
  );
}

export default StockList;