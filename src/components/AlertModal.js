import React from 'react';
import './AlertModal.css';

export function AlertModal({ message, onClose, type = 'info', onConfirm, showConfirmButton = false }) {
  return (
    <div className="alert-modal-backdrop" onClick={onClose}>
      <div className="alert-modal-content" onClick={e => e.stopPropagation()}>
        <div className={`alert-message ${type}`}>{message}</div>
        <div className="alert-buttons">
          {showConfirmButton ? (
            <>
              <button className="alert-button confirm" onClick={onConfirm}>Confirm</button>
              <button className="alert-button cancel" onClick={onClose}>Cancel</button>
            </>
          ) : (
            <button className="alert-button" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}