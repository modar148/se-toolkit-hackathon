import React from 'react';
import { Navbar } from './Navbar';
import './Layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="bg-light border-top py-3 mt-5">
        <div className="container text-center text-muted">
          <small>&copy; 2026 Event Booking System. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};
