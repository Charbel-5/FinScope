import React from 'react';
import './AuthModal.css';

export function AuthModal({ children, onClose }) {
  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}