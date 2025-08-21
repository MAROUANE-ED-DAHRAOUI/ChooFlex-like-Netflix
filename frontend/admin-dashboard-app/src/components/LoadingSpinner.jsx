import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
