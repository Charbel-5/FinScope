// ...existing code...
import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import './AddStockForm.css';

function AddStockForm({ onClose, initialTicker, initialQuantity, onEditStock }) {
  const { addStock } = useStocks();
  const [ticker, setTicker] = useState(initialTicker || '');
  const [quantity, setQuantity] = useState(initialQuantity || '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!ticker || !quantity) return;
    
    if (initialTicker) {
      // Editing existing
      onEditStock(initialTicker, ticker.trim().toUpperCase(), quantity);
    } else {
      // Adding new
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
          <div>
            <button type="submit">Add Stock</button>
          </div>
          <div>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default AddStockForm;