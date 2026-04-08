import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenueById, getSeatsByVenue, createSeat } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, Alert, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminSeats = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [venue, setVenue] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const [formData, setFormData] = useState({
    rowLabel: 'A',
    seatNumber: '',
    quantity: 1
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [venueResponse, seatsResponse] = await Promise.all([
          getVenueById(venueId),
          getSeatsByVenue(venueId)
        ]);

        setVenue(venueResponse.data);
        setSeats(seatsResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load venue or seats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      loadData();
    }
  }, [venueId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!formData.rowLabel.trim()) {
      setCreateError('Row label is required');
      return;
    }

    const quantity = parseInt(formData.quantity) || 1;
    if (quantity <= 0 || quantity > 100) {
      setCreateError('Quantity must be between 1 and 100');
      return;
    }

    try {
      setCreating(true);

      // Create seats
      for (let i = 1; i <= quantity; i++) {
        await createSeat(venueId, formData.rowLabel, i);
      }

      // Reload seats
      const seatsResponse = await getSeatsByVenue(venueId);
      setSeats(seatsResponse.data);

      setCreateSuccess(`${quantity} seat(s) created successfully for Row ${formData.rowLabel}`);
      setFormData({
        rowLabel: 'A',
        seatNumber: '',
        quantity: 1
      });
    } catch (err) {
      setCreateError('Failed to create seats. Please try again.');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="alert alert-danger">
            Access denied. Admin privileges required.
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

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.rowLabel]) {
      seatsByRow[seat.rowLabel] = [];
    }
    seatsByRow[seat.rowLabel].push(seat);
  });

  const rows = Object.keys(seatsByRow).sort();

  return (
    <Layout>
      <div className="container mt-4">
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate('/admin/venues')}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Venues
          </button>
          <h2 className="d-inline">Manage Seats - {venue?.name}</h2>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Create Seats</h5>
              </div>
              <div className="card-body">
                {createError && <Alert type="danger" message={createError} />}
                {createSuccess && <Alert type="success" message={createSuccess} />}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Row Label</label>
                    <input
                      type="text"
                      className="form-control"
                      name="rowLabel"
                      value={formData.rowLabel}
                      onChange={handleChange}
                      placeholder="e.g., A, B, C"
                      maxLength="2"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Quantity of Seats</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      max="100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Create Seats'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Existing Seats</h5>
              </div>
              <div className="card-body">
                {rows.length === 0 ? (
                  <p className="text-muted">No seats created yet.</p>
                ) : (
                  <div>
                    {rows.map(row => (
                      <div key={row} className="mb-3">
                        <strong>Row {row}:</strong>
                        <div className="mt-2 p-2 bg-light rounded">
                          {seatsByRow[row].map(seat => (
                            <span
                              key={seat.id}
                              className="badge bg-secondary me-2 mb-2"
                            >
                              {seat.seatNumber}
                            </span>
                          ))}
                        </div>
                        <small className="text-muted">
                          {seatsByRow[row].length} seat(s) in this row
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSeats;