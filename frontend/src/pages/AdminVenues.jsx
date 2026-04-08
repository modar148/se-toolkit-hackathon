import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVenues, deleteVenue } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, Alert, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminVenues = () => {
  const { user } = useUser();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const loadVenues = async () => {
      try {
        setLoading(true);
        const response = await getVenues();
        setVenues(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load venues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [user]);

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(venueId);
      setDeleteError(null);
      setDeleteSuccess(null);

      await deleteVenue(venueId);

      setVenues(prevVenues => prevVenues.filter(venue => venue.id !== venueId));
      setDeleteSuccess('Venue deleted successfully');
    } catch (err) {
      setDeleteError('Failed to delete venue');
      console.error(err);
    } finally {
      setDeleteLoading(null);
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manage Venues</h1>
          <Link to="/admin/venues/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Create Venue
          </Link>
        </div>

        {deleteError && (
          <Alert type="danger" message={deleteError} />
        )}

        {deleteSuccess && (
          <Alert type="success" message={deleteSuccess} />
        )}

        {venues.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No venues found</h4>
            <p>Get started by creating your first venue.</p>
            <Link to="/admin/venues/create" className="btn btn-primary">
              Create First Venue
            </Link>
          </div>
        ) : (
          <div className="row">
            {venues.map(venue => (
              <div key={venue.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{venue.name}</h5>
                    <div className="btn-group">
                      <Link
                        to={`/admin/venues/${venue.id}/edit`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteVenue(venue.id)}
                        disabled={deleteLoading === venue.id}
                      >
                        {deleteLoading === venue.id ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      <strong>Location:</strong> {venue.location}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/venues/${venue.id}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/admin/venues/${venue.id}/seats`}
                        className="btn btn-outline-info btn-sm"
                      >
                        Manage Seats
                      </Link>
                    </div>
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

export default AdminVenues;