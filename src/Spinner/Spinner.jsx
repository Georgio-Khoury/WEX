// Create a new component for the loading spinner
import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
