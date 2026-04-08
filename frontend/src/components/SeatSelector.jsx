import React, { useState, useEffect } from 'react';
import { getSeatsByVenue, getBookingsByEvent } from '../api/services';
import './SeatSelector.css';

export const SeatSelector = ({ venueId, eventId, onSeatsSelected, isLoading }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);
        const seatsResponse = await getSeatsByVenue(venueId);
        setSeats(seatsResponse.data);
        setError(null);

        // Load booked seats for this event
        if (eventId) {
          try {
            const bookingsResponse = await getBookingsByEvent(eventId);
            const allBookedSeats = new Set();
            bookingsResponse.data.forEach(booking => {
              booking.seats?.forEach(seat => {
                allBookedSeats.add(seat.id);
              });
            });
            setBookedSeats(allBookedSeats);
          } catch (err) {
            console.error('Failed to load booked seats:', err);
          }
        }
      } catch (err) {
        setError('Failed to load seats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      loadSeats();
    }
  }, [venueId, eventId]);

  const toggleSeat = (seatId) => {
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
    onSeatsSelected?.(Array.from(newSelected));
  };

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.rowLabel]) {
      seatsByRow[seat.rowLabel] = [];
    }
    seatsByRow[seat.rowLabel].push(seat);
  });

  if (loading) {
    return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (seats.length === 0) {
    return <div className="alert alert-info">No seats available for this venue.</div>;
  }

  return (
    <div className="seat-selector">
      <div className="mb-3">
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat-item available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat-item selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat-item booked"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="seats-grid">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats-row">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  className={`seat-item ${
                    bookedSeats.has(seat.id) ? 'booked' : ''
                  } ${selectedSeats.has(seat.id) ? 'selected' : 'available'}`}
                  onClick={() => {
                    if (!bookedSeats.has(seat.id)) {
                      toggleSeat(seat.id);
                    }
                  }}
                  disabled={bookedSeats.has(seat.id) || isLoading}
                  title={`Row ${row}, Seat ${seat.seatNumber}`}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSeats.size > 0 && (
        <div className="alert alert-info mt-3">
          <strong>{selectedSeats.size} seat(s) selected</strong>
        </div>
      )}
    </div>
  );
};
