import React from 'react';
import './MonthlySwitcher.css';

function MonthlySwitcher({ displayMonthYear, onPrevious, onNext }) {
  return (
    <div className="monthly-switcher">
      <button onClick={onPrevious}>&lt;</button>
      <span>{displayMonthYear}</span>
      <button onClick={onNext}>&gt;</button>
    </div>
  );
}

export default MonthlySwitcher;