import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, getVenueById, createBooking } from '../api/services';
import { useUser } from '../context/UserContext';
import { SeatSelector } from '../components/SeatSelector';
import { LoadingSpinner, Alert, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadEventAndVenue = async () => {
      try {
        setLoading(true);
        const eventResponse = await getEventById(eventId);
        setEvent(eventResponse.data);

        const venueResponse = await getVenueById(eventResponse.data.venueId);
        setVenue(venueResponse.data);

        setError(null);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEventAndVenue();
    }
  }, [eventId]);

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    if (selectedSeats.length === 0) {
      setBookingError('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      await createBooking(user.id, eventId, selectedSeats);

      setBookingSuccess(true);
      setSelectedSeats([]);

      // Redirect to my bookings after a short delay
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);

    } catch (err) {
      setBookingError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

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

  if (!event || !venue) {
    return (
      <Layout>
        <ErrorState message="Event not found" />
      </Layout>
    );
  }

  const eventDate = new Date(event.eventDateTime);
  const isPastEvent = eventDate < new Date();

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title mb-0">{event.title}</h2>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5>Event Details</h5>
                    <p><strong>Date & Time:</strong> {eventDate.toLocaleString()}</p>
                    <p><strong>Venue:</strong> {venue.name}</p>
                    <p><strong>Location:</strong> {venue.location}</p>
                    <p><strong>Price per seat:</strong> ${event.price}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Description</h5>
                    <p>{event.description}</p>
                  </div>
                </div>

                {!isPastEvent && (
                  <div className="mt-4">
                    <h5>Select Your Seats</h5>
                    <SeatSelector
                      venueId={venue.id}
                      eventId={eventId}
                      onSeatsSelected={handleSeatsSelected}
                      isLoading={bookingLoading}
                    />

                    {selectedSeats.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{selectedSeats.length} seat(s) selected</strong>
                            <br />
                            <small>Total: ${(selectedSeats.length * event.price).toFixed(2)}</small>
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={handleBooking}
                            disabled={bookingLoading}
                          >
                            {bookingLoading ? 'Booking...' : 'Book Seats'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isPastEvent && (
                  <div className="alert alert-warning">
                    This event has already passed and is no longer available for booking.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Venue Information</h5>
              </div>
              <div className="card-body">
                <h6>{venue.name}</h6>
                <p className="text-muted">{venue.location}</p>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
                  View Venue Details
                </button>
              </div>
            </div>

            {user && (
              <div className="card mt-3">
                <div className="card-header">
                  <h5 className="card-title mb-0">My Bookings</h5>
                </div>
                <div className="card-body">
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={() => navigate('/my-bookings')}
                  >
                    View My Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {bookingError && (
          <Alert type="danger" message={bookingError} />
        )}

        {bookingSuccess && (
          <Alert
            type="success"
            message="Booking created successfully! Redirecting to your bookings..."
          />
        )}
      </div>
    </Layout>
  );
};

export default EventDetails;