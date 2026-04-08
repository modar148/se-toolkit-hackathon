import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, ErrorState } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        const response = await getAllBookings();
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      CONFIRMED: 'bg-success',
      CANCELLED: 'bg-danger',
      PENDING: 'bg-warning'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length
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
        <h1 className="mb-4">Bookings Management</h1>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-primary">{stats.total}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-success">{stats.confirmed}</h3>
                <p className="text-muted mb-0">Confirmed</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-danger">{stats.cancelled}</h3>
                <p className="text-muted mb-0">Cancelled</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-warning">{stats.pending}</h3>
                <p className="text-muted mb-0">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-3">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('ALL')}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'CONFIRMED' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('CONFIRMED')}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'CANCELLED' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('CANCELLED')}
            >
              Cancelled ({stats.cancelled})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'PENDING' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('PENDING')}
            >
              Pending ({stats.pending})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No bookings found</h4>
            <p>No {filter.toLowerCase()} bookings to display.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Seats</th>
                  <th>Total Price</th>
                  <th>Booked On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => {
                  const bookedDate = new Date(booking.createdAt);
                  return (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>
                        <div>
                          <strong>{booking.user?.fullName || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{booking.user?.email || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.event?.title || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{booking.event?.venue?.name || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <small>
                          {booking.seats?.map(seat => `Row ${seat.rowLabel}-${seat.seatNumber}`).join(', ') || 'N/A'}
                        </small>
                      </td>
                      <td>${booking.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td>{bookedDate.toLocaleString()}</td>
                      <td>{getStatusBadge(booking.status)}</td>
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

export default AdminBookings;