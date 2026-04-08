import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelBooking } from '../api/services';

export const EventCard = ({ event, onEdit, onDelete, isAdmin }) => {
  const eventDate = new Date(event.eventDateTime);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card card-hover">
      <div className="card-body">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text">{event.description}</p>
        <p className="card-text">
          <small className="text-secondary">
            📍 {event.venue?.name || 'Unknown Venue'}
          </small>
        </p>
        <p className="card-text">
          <small className="text-secondary">
            📅 {formattedDate} {formattedTime}
          </small>
        </p>
        <p className="card-text">
          <strong>${event.price}</strong>
        </p>
        <Link
          to={`/events/${event.id}`}
          className="btn btn-sm btn-primary"
        >
          Book Now
        </Link>
        {isAdmin && (
          <>
            <button
              className="btn btn-sm btn-warning ms-2"
              onClick={() => onEdit?.(event.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger ms-2"
              onClick={() => onDelete?.(event.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const BookingCard = ({ booking, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await cancelBooking(booking.id);
      setSuccess(true);
      setTimeout(() => {
        onRefresh?.();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to cancel booking'
      );
    } finally {
      setLoading(false);
    }
  };

  const seatList = booking.seats?.map(s => `${s.rowLabel}${s.seatNumber}`).join(', ') || 'N/A';

  return (
    <div className="card">
      <div className="card-body">
        {success && (
          <div className="alert alert-success fade-in">
            Booking cancelled successfully!
          </div>
        )}
        {error && (
          <div className="alert alert-danger fade-in">
            {error}
          </div>
        )}
        <h5 className="card-title">
          Booking #{booking.id}
        </h5>
        <p className="card-text">
          <strong>Event:</strong> #{booking.eventId}
        </p>
        <p className="card-text">
          <strong>Seats:</strong> {seatList}
        </p>
        <p className="card-text">
          <strong>Status:</strong>{' '}
          <span className={`badge ${booking.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
            {booking.status}
          </span>
        </p>
        <p className="card-text">
          <small className="text-muted">
            Booked on {new Date(booking.createdAt).toLocaleDateString()}
          </small>
        </p>
        {booking.status === 'CONFIRMED' && (
          <button
            className="btn btn-sm btn-danger"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
};
