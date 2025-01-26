import React, { useState } from 'react';
import './StockList.css';

function StockList({ data, onEdit, onDelete, loading, error }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (loading) {
    return <div className="status-message">Loading stock prices...</div>;
  }

  if (error) {
    return <div className="status-message">{error}</div>; // Removed error class
  }

  if (!data || data.length === 0) {
    return <div className="status-message">Add your first stock to track its performance</div>;
  }

  return (
    <div className="stock-list">
      {data.map((holding, idx) => (
        <div
          key={holding.ticker}
          className="stock-item"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="stock-content">
            <div className="stock-detail">
              <span className="stock-label">Ticker</span>
              <span className="stock-value">{holding.ticker}</span>
            </div>
            <div className="stock-detail">
              <span className="stock-label">Price</span>
              <span className="stock-value">${holding.price.toFixed(2)}</span>
            </div>
            <div className="stock-detail">
              <span className="stock-label">Quantity</span>
              <span className="stock-value">{holding.quantity}</span>
            </div>
            <div className="stock-detail">
              <span className="stock-label">Total Value</span>
              <span className="stock-value">${holding.totalValue.toFixed(2)}</span>
            </div>
          </div>
          
          {hoveredIndex === idx && (
            <div className="stock-actions">
              <button onClick={() => onEdit(holding)}>Edit</button>
              <button className="delete" onClick={() => onDelete(holding.ticker)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StockList;