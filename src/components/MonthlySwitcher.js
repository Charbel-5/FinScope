// ...existing code...
import React, { useState } from 'react';
import './MonthlySwitcher.css';

function MonthlySwitcher({ 
  displayMonthYear, 
  onPrevious, 
  onNext, 
  availableMonths, 
  onSelectMonth 
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleMonthClick = () => {
    setIsSelectorOpen(!isSelectorOpen);
  };

  const handleSelect = (index) => {
    onSelectMonth(index);
    setIsSelectorOpen(false);
  };

  return (
    <>
      <div className="monthly-switcher">
        <button onClick={onPrevious}>&lt;</button>
        <span onClick={handleMonthClick} style={{ cursor: 'pointer' }}>
          {displayMonthYear}
        </span>
        <button onClick={onNext}>&gt;</button>
      </div>

      {isSelectorOpen && (
        <div className="month-selector-backdrop" onClick={() => setIsSelectorOpen(false)}>
          <div className="month-selector-content" onClick={(e) => e.stopPropagation()}>
            {availableMonths.map((m, idx) => (
              <div 
                key={idx} 
                className="month-selector-item"
                onClick={() => handleSelect(idx)}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default MonthlySwitcher;