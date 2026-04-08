import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVenue } from '../api/services';
import { useUser } from '../context/UserContext';
import { Alert } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminCreateVenue = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    if (!formData.name.trim() || !formData.location.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await createVenue(formData.name, formData.location);
      navigate('/admin/venues');
    } catch (err) {
      setError('Failed to create venue. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mb-0">Create New Venue</h3>
              </div>
              <div className="card-body">
                {error && <Alert type="danger" message={error} />}

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
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Venue'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin/venues')}
                      disabled={loading}
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

export default AdminCreateVenue;