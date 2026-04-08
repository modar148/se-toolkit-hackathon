import React, { useState, useEffect } from 'react';

export const Alert = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!show) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade-in show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={() => {
          setShow(false);
          onClose?.();
        }}
        aria-label="Close"
      ></button>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md' }) => {
  const spinnerClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: ''
  }[size];

  return (
    <div className="text-center p-5">
      <div className={`spinner-border ${spinnerClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const EmptyState = ({ message = 'No data available', icon = '📭' }) => (
  <div className="text-center p-5">
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
    <p className="text-muted">{message}</p>
  </div>
);

export const ErrorState = ({ message = 'An error occurred', onRetry }) => (
  <div className="alert alert-danger" role="alert">
    <h4 className="alert-heading">Error</h4>
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-danger btn-sm" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);
