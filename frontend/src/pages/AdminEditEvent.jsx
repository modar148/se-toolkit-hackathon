import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, getVenues, updateEvent } from '../api/services';
import { useUser } from '../context/UserContext';
import { Alert, LoadingSpinner, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminEditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventResponse, venuesResponse] = await Promise.all([
          getEventById(eventId),
          getVenues()
        ]);

        setVenues(venuesResponse.data);

        const eventDate = new Date(eventResponse.data.eventDateTime).toISOString().slice(0, 16);

        setFormData({
          title: eventResponse.data.title,
          description: eventResponse.data.description,
          eventDateTime: eventDate,
          price: eventResponse.data.price,
          venueId: eventResponse.data.venueId
        });

        setError(null);
      } catch (err) {
        setError('Failed to load event');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadData();
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);

    if (!formData.title.trim() || !formData.description.trim() || !formData.eventDateTime || !formData.price || !formData.venueId) {
      setSaveError('All fields are required');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setSaveError('Price must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      await updateEvent(
        eventId,
        formData.title,
        formData.description,
        formData.eventDateTime,
        parseFloat(formData.price),
        formData.venueId
      );
      navigate('/admin/events');
    } catch (err) {
      setSaveError('Failed to update event. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
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

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mb-0">Edit Event</h3>
              </div>
              <div className="card-body">
                {saveError && <Alert type="danger" message={saveError} />}

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
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin/events')}
                      disabled={saving}
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

export default AdminEditEvent;