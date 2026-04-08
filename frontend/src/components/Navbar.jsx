import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          📅 Event Booking
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/venues">Venues</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">My Bookings</Link>
              </li>
            )}
            {user?.role === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin">Dashboard</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/venues">Manage Venues</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/events">Manage Events</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/bookings">All Bookings</Link>
                  </li>
                </ul>
              </li>
            )}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.fullName}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
