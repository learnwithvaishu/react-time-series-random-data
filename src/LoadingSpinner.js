import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="overlay">
    <div className="overlay_inner">
        <div className="overlay_content"><span className="spinner"></span></div>
    </div>
</div>
  );
}

export default LoadingSpinner;