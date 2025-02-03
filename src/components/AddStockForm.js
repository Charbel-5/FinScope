import React, { useState } from 'react';
import { useStocks } from '../context/StocksContext';
import './AddStockForm.css';

function AddStockForm({ onClose, initialTicker, initialQuantity, onEditStock }) {
  const { addStock, stockHoldings } = useStocks();
  const [ticker, setTicker] = useState(initialTicker || '');
  const [quantity, setQuantity] = useState(initialQuantity ? Number(initialQuantity).toFixed(5) : '');
  const [message, setMessage] = useState('');

  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, '');
    setQuantity(value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ticker || !quantity) {
      setMessage('Please enter both ticker and quantity');
      return;
    }

    const formattedQuantity = Number(parseFloat(quantity).toFixed(5));
    if (isNaN(formattedQuantity) || formattedQuantity <= 0) {
      setMessage('Please enter a valid quantity');
      return;
    }

    const formattedTicker = ticker.trim().toUpperCase();

    try {
      if (initialTicker) {
        await onEditStock(initialTicker, formattedTicker, formattedQuantity);
      } else {
        const existingStock = stockHoldings.find(
          s => s.ticker.toUpperCase() === formattedTicker
        );

        if (existingStock) {
          const existingQuantity = Number(parseFloat(existingStock.quantity).toFixed(5));
          const newQuantity = Number((existingQuantity + formattedQuantity).toFixed(5));

          if (isNaN(newQuantity)) {
            throw new Error('Invalid quantity calculation');
          }

          await onEditStock(existingStock.ticker, existingStock.ticker, newQuantity);
          setMessage('Updated existing stock quantity');
          setTimeout(onClose, 1500);
          return;
        }

        await addStock(formattedTicker, formattedQuantity);
      }
      onClose();
    } catch (err) {
      console.error('Stock operation failed:', err);
      setMessage(err.response?.status === 404 ? 
        'Invalid stock ticker. Please check and try again.' : 
        'Error: ' + (err.response?.data?.message || err.message)
      );
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
            type="text"
            pattern="[0-9.]*"
            inputMode="decimal"
            placeholder="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <div>
            <button type="submit">{initialTicker ? 'Edit Stock' : 'Add Stock'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStockForm;