// ...existing code...
import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import './AddStockForm.css';

function AddStockForm({ onClose }) {
  const { addStock } = useStocks();
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (ticker && quantity) {
      addStock(ticker.trim().toUpperCase(), quantity);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Stock</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <input
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button type="submit">Add Stock</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AddStockForm;