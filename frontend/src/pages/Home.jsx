import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const Home = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold mb-4">Welcome to Event Booking</h1>
          <p className="lead mb-4">
            Discover amazing events, book your seats, and enjoy unforgettable experiences. 
            From concerts to conferences, we've got you covered.
          </p>
          <div className="d-flex gap-3">
            <Link to="/venues" className="btn btn-primary btn-lg">
              Browse Venues
            </Link>
            <Link to="/events" className="btn btn-outline-primary btn-lg">
              View Events
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-success btn-lg ms-3">
                Get Started
              </Link>
            )}
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div style={{ fontSize: '5rem' }}>🎭</div>
        </div>
      </div>

      {user && (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Welcome back, {user.fullName}!</h4>
          <p>You're logged in and ready to book events.</p>
          <hr />
          <Link to="/my-bookings" className="btn btn-sm btn-success">
            View My Bookings
          </Link>
        </div>
      )}

      <hr className="my-5" />

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏛️</div>
              <h5 className="card-title">Explore Venues</h5>
              <p className="card-text">
                Discover hundreds of amazing venues across the country.
              </p>
              <Link to="/venues" className="btn btn-sm btn-primary">
                Browse Venues
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📅</div>
              <h5 className="card-title">View Events</h5>
              <p className="card-text">
                Check out upcoming events and book your favorite ones.
              </p>
              <Link to="/events" className="btn btn-sm btn-primary">
                See Events
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎫</div>
              <h5 className="card-title">My Bookings</h5>
              <p className="card-text">
                Keep track of all your bookings in one place.
              </p>
              {user ? (
                <Link to="/my-bookings" className="btn btn-sm btn-primary">
                  View Bookings
                </Link>
              ) : (
                <Link to="/register" className="btn btn-sm btn-primary">
                  Register First
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
