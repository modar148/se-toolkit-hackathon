import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsByUser, cancelBooking } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, Alert, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingsByUser(user.id);
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancelLoading(bookingId);
      setCancelError(null);
      setCancelSuccess(null);

      await cancelBooking(bookingId);

      // Update the booking status locally
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'CANCELLED' }
            : booking
        )
      );

      setCancelSuccess('Booking cancelled successfully');
    } catch (err) {
      setCancelError('Failed to cancel booking');
      console.error(err);
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      CONFIRMED: 'bg-success',
      CANCELLED: 'bg-danger',
      PENDING: 'bg-warning'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="alert alert-warning">
            Please register or login to view your bookings.
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Bookings</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/events')}
          >
            Browse Events
          </button>
        </div>

        {cancelError && (
          <Alert type="danger" message={cancelError} />
        )}

        {cancelSuccess && (
          <Alert type="success" message={cancelSuccess} />
        )}

        {bookings.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No bookings found</h4>
            <p>You haven't made any bookings yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/events')}
            >
              Browse Available Events
            </button>
          </div>
        ) : (
          <div className="row">
            {bookings.map(booking => (
              <div key={booking.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      Booking #{booking.id}
                    </h5>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Event:</strong> {booking.event?.title || 'Unknown Event'}
                      <br />
                      <strong>Venue:</strong> {booking.event?.venue?.name || 'Unknown Venue'}
                      <br />
                      <strong>Date:</strong> {booking.event ? new Date(booking.event.eventDateTime).toLocaleString() : 'Unknown'}
                      <br />
                      <strong>Seats:</strong> {booking.seats?.map(seat => `Row ${seat.rowLabel}, Seat ${seat.seatNumber}`).join(', ') || 'No seats'}
                      <br />
                      <strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleString()}
                      <br />
                      <strong>Total Price:</strong> ${booking.totalPrice?.toFixed(2) || '0.00'}
                    </div>

                    {booking.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelLoading === booking.id}
                      >
                        {cancelLoading === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;