import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import './AddStockForm.css';

function AddStockForm({ onClose, initialTicker, initialQuantity, onEditStock }) {
  const { addStock, stockHoldings } = useStocks();
  const [ticker, setTicker] = useState(initialTicker || '');
  const [quantity, setQuantity] = useState(initialQuantity || '');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ticker || !quantity) return;
    
    try {
      if (initialTicker) {
        // Editing existing
        await onEditStock(initialTicker, ticker.trim().toUpperCase(), quantity);
      } else {
        // Check if stock exists
        const exists = stockHoldings.some(
          s => s.ticker.toUpperCase() === ticker.trim().toUpperCase()
        );
        
        // Adding new or updating existing
        await addStock(ticker.trim().toUpperCase(), quantity);
        
        if (exists) {
          setMessage('Updated existing stock quantity');
          setTimeout(onClose, 1500);
          return;
        }
      }
      onClose();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{initialTicker ? 'Edit Stock' : 'Add New Stock'}</h3>
        {message && <div className="message">{message}</div>}
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
            <button type="submit">{initialTicker ? 'Edit Stock' : 'Add Stock'}</button>
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