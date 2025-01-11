import React from 'react';
import { useState } from 'react';

function StockList({ data, onEdit, onDelete }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div>
      {data.map((h, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            margin: '16px',
            padding: '16px',
            backgroundColor: '#fff',
            width: '90%',
            marginLeft: '4%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '8px',
            position: 'relative'
          }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <table>
            <tr>
              <td>
                <div>Ticker: {h.ticker}</div>
              </td>
              <td>
                <div style={ {marginLeft: '30px'} }>Price: {h.price}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Quantity: {h.quantity}</div>
              </td>
              <td>
                <div style={ {marginLeft: '30px'} }>Total: {h.totalValue}</div>
              </td>
            </tr>
          </table>
          {hoveredIndex === idx && (
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'row',
                gap: '8px'
              }}
            >
              <button onClick={() => onEdit(h)}>Edit</button>
              <button onClick={() => onDelete(h.ticker)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StockList;