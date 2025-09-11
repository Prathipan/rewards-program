import React from 'react';
import PropTypes from 'prop-types';

/* Loading spinner component  */
const LoadingSpinner = ({ message = 'Loading transaction data...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;
