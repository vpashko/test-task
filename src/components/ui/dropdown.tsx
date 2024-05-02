import React from 'react';
import './dropdown.css';

const Dropdown = ( {options, onChange, selectedValue} ) => {
  return (
    <select title='select' value={selectedValue} className='select' onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value} className='option'>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;