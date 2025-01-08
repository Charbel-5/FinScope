// ...existing code...
import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import AddStockForm from '../components/AddStockForm';
import StockList from '../components/StockList';

function Stocks() {
  const { mapHoldingsToPrices, getTotalValue } = useStocks();
  const [showForm, setShowForm] = useState(false);

  const holdingsWithPrices = mapHoldingsToPrices();
  const totalValue = getTotalValue();

  return (
    <div style={{ padding: '20px' }}>
      <div>Total Portfolio Value: {totalValue}</div>
      <button onClick={() => setShowForm(true)} style={{ float: 'right' }}>+</button>

      {showForm && (
        <AddStockForm onClose={() => setShowForm(false)} />
      )}

      <StockList data={holdingsWithPrices} />
    </div>
  );
}

export default Stocks;