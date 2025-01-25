import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import AddStockForm from '../components/AddStockForm';
import StockList from '../components/StockList';
import './Stocks.css';

function Stocks() {
  const { mapHoldingsToPrices, getTotalValue, editStock, deleteStock, loading, error } = useStocks();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const holdingsWithPrices = mapHoldingsToPrices();
  const totalValue = getTotalValue();

  function handleEdit(holding) {
    setEditData(holding);
    setShowForm(true);
  }

  function handleDelete(ticker) {
    deleteStock(ticker);
  }

  return (
    <div className="stocks-container">
      <div className="portfolio-overview">
        <h2>Portfolio Overview</h2>
        <div className="total-value">${totalValue.toFixed(2)}</div>
      </div>

      <button
        className="add-stock-button"
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
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Stocks;