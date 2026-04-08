import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVenueById, updateVenue } from '../api/services';
import { useUser } from '../context/UserContext';
import { Alert, LoadingSpinner, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminEditVenue = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        setLoading(true);
        const response = await getVenueById(venueId);
        setFormData({
          name: response.data.name,
          location: response.data.location
        });
        setError(null);
      } catch (err) {
        setError('Failed to load venue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      loadVenue();
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
    setSaveError(null);

    if (!formData.name.trim() || !formData.location.trim()) {
      setSaveError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      await updateVenue(venueId, formData.name, formData.location);
      navigate('/admin/venues');
    } catch (err) {
      setSaveError('Failed to update venue. Please try again.');
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
                <h3 className="card-title mb-0">Edit Venue</h3>
              </div>
              <div className="card-body">
                {saveError && <Alert type="danger" message={saveError} />}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Venue Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Convention Center"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Downtown, Cairo"
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
                      onClick={() => navigate('/admin/venues')}
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

export default AdminEditVenue;