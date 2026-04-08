import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVenueById, getEventsByVenue, getSeatsByVenue } from '../api/services';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner, EmptyState } from '../components/shared';

export const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [venueRes, eventsRes, seatsRes] = await Promise.all([
          getVenueById(id),
          getEventsByVenue(id),
          getSeatsByVenue(id)
        ]);

        setVenue(venueRes.data);
        setEvents(eventsRes.data);
        setSeats(seatsRes.data);
      } catch (err) {
        setError('Failed to load venue details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVenueDetails();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <br />
        <Link to="/venues" className="btn btn-sm btn-primary mt-2">
          Back to Venues
        </Link>
      </div>
    );
  }

  if (!venue) return <EmptyState message="Venue not found" />;

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.rowLabel]) {
      seatsByRow[seat.rowLabel] = [];
    }
    seatsByRow[seat.rowLabel].push(seat);
  });

  return (
    <div>
      <Link to="/venues" className="btn btn-outline-secondary mb-3">
        ← Back to Venues
      </Link>

      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{venue.name}</h1>
          <p className="card-text lead">📍 {venue.location}</p>
          <p className="card-text text-muted">
            Created {new Date(venue.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h2>Events at this Venue</h2>
          {events.length === 0 ? (
            <EmptyState message="No events scheduled" icon="📭" />
          ) : (
            <div className="row g-3">
              {events.map(event => (
                <div key={event.id} className="col-12">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-4">
          <h2>Seat Layout</h2>
          {seats.length === 0 ? (
            <EmptyState message="No seats configured" icon="🪑" />
          ) : (
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))', gap: '0.5rem' }}>
                  {seats.map(seat => (
                    <div
                      key={seat.id}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: '#e7f3ff'
                      }}
                    >
                      {seat.rowLabel}{seat.seatNumber}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-muted">
                  <small>Total seats: {seats.length}</small>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
