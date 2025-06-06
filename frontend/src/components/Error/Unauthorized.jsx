import React from 'react';
import { Link } from 'react-router-dom';

export const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="button primary">
        Return to Home
      </Link>
    </div>
  );
}; 