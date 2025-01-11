// ...existing code...
import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import AddStockForm from '../components/AddStockForm';
import StockList from '../components/StockList';
import '../pages/Transactions.css';

function Stocks() {
  const { mapHoldingsToPrices, getTotalValue, editStock, deleteStock } = useStocks();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const holdingsWithPrices = mapHoldingsToPrices();
  const totalValue = getTotalValue();

  function handleEdit(h) {
    setEditData(h);
    setShowForm(true);
  }

  function handleDelete(ticker) {
    deleteStock(ticker);
  }

  return (
    <div style={{ padding: '20px' }}>
      
      <h2 style={ {textAlign: 'center'} }>Holdings</h2>

      <div  style={ {textAlign: 'center'} }>Total Portfolio Value: {totalValue}</div>
      <button
        className="add-transaction-button"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {showForm && (
        <AddStockForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          initialTicker={editData?.ticker}
          initialQuantity={editData?.quantity}
          onEditStock={editStock}
        />
      )}

      <StockList
        data={holdingsWithPrices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Stocks;