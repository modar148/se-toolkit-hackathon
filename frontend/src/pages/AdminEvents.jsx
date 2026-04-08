import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, Alert, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminEvents = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents();
        setEvents(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(eventId);
      setDeleteError(null);
      setDeleteSuccess(null);

      await deleteEvent(eventId);

      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setDeleteSuccess('Event deleted successfully');
    } catch (err) {
      setDeleteError('Failed to delete event');
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
          <h1>Manage Events</h1>
          <Link to="/admin/events/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Create Event
          </Link>
        </div>

        {deleteError && (
          <Alert type="danger" message={deleteError} />
        )}

        {deleteSuccess && (
          <Alert type="success" message={deleteSuccess} />
        )}

        {events.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No events found</h4>
            <p>Get started by creating your first event.</p>
            <Link to="/admin/events/create" className="btn btn-primary">
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Event Title</th>
                  <th>Venue</th>
                  <th>Date & Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => {
                  const eventDate = new Date(event.eventDateTime);
                  return (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.venue?.name || 'N/A'}</td>
                      <td>{eventDate.toLocaleString()}</td>
                      <td>${event.price}</td>
                      <td>
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deleteLoading === event.id}
                        >
                          {deleteLoading === event.id ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminEvents;