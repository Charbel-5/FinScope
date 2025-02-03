import React, { useState } from 'react';
import './MonthlySwitcher.css';

function MonthlySwitcher({ 
  displayMonthYear, //current month year
  onPrevious, //function that increments the index
  onNext, //function that decrements the index
  availableMonths, //the list of all the months
  onSelectMonth //function that changes the index with out input of the index
}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  //when called we change the state
  const handleMonthClick = () => {
    setIsSelectorOpen(!isSelectorOpen);
  };
  //when called it calls the hook that changes the index in transactions, and puts the state of the selector to fals
  const handleSelect = (index) => {
    onSelectMonth(index);
    setIsSelectorOpen(false);
  };


  //the first button when clicked will call the function that increments an index using the hook
  //the second button just displays the calls the function to display the selector
  //the thrid button is just like the first button

  //the selector:
  //when we click on the backdrop we set it to false
  //when we click on a month stop propagation just stops the cliking onto a parent component
  //the selector creates the html by map of all available months year, and we put an index to each of them
  //if one of them is clicked on we call the select function that changes the index accordingly using a hook
  return (
    <>
      <div className="monthly-switcher"> 
        <button onClick={onPrevious}>&lt;</button>
        <span className='month-day-showcaser' onClick={handleMonthClick} style={{ cursor: 'pointer' }}>
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