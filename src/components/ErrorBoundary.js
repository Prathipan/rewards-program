import React from "react";
import PropTypes from "prop-types";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorBoundary = ({ children, onReset }) => {
  const fallbackRender = ({ error, resetErrorBoundary }) => {
    const handleReset = () => {
      if (typeof onReset === 'function') {
        onReset();
      } else if (typeof window !== 'undefined') {
        window.location.reload();
      }
      resetErrorBoundary();
    };


    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>An unexpected error occurred while rendering the application.</p>
        {error && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre>
        )}
        <button onClick={handleReset} className="retry-button">Reload</button>
      </div>
    );
  };

  return (
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      {children}
    </ReactErrorBoundary>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};

export default ErrorBoundary;


