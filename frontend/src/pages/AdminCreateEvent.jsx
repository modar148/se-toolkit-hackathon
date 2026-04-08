import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getVenues } from '../api/services';
import { useUser } from '../context/UserContext';
import { Alert, LoadingSpinner } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminCreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDateTime: '',
    price: '',
    venueId: ''
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const response = await getVenues();
        setVenues(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            venueId: response.data[0].id
          }));
        }
      } catch (err) {
        setError('Failed to load venues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim() || !formData.eventDateTime || !formData.price || !formData.venueId) {
      setError('All fields are required');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setCreating(true);
      await createEvent(
        formData.title,
        formData.description,
        formData.eventDateTime,
        parseFloat(formData.price),
        formData.venueId,
        user.id
      );
      navigate('/admin/events');
    } catch (err) {
      setError('Failed to create event. Please try again.');
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

  if (venues.length === 0) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="alert alert-warning">
            Please create a venue before creating an event.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mb-0">Create New Event</h3>
              </div>
              <div className="card-body">
                {error && <Alert type="danger" message={error} />}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Event Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Concert 2026"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Event description"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Venue</label>
                    <select
                      className="form-control"
                      name="venueId"
                      value={formData.venueId}
                      onChange={handleChange}
                    >
                      {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="eventDateTime"
                      value={formData.eventDateTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price per Seat</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={creating}
                    >
                      {creating ? 'Creating...' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin/events')}
                      disabled={creating}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCreateEvent;