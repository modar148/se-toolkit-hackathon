import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getAdminStats } from '../api/services';
import { LoadingSpinner } from '../components/shared';
import { Layout } from '../components/Layout';

const AdminDashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

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

  const adminActions = [
    {
      title: 'Manage Venues',
      description: 'Create, edit, and delete venues',
      actions: [
        { label: 'Create Venue', path: '/admin/venues/create', icon: 'bi-plus-circle' },
        { label: 'View All Venues', path: '/admin/venues', icon: 'bi-list' }
      ]
    },
    {
      title: 'Manage Events',
      description: 'Create, edit, and delete events',
      actions: [
        { label: 'Create Event', path: '/admin/events/create', icon: 'bi-plus-circle' },
        { label: 'View All Events', path: '/admin/events', icon: 'bi-list' }
      ]
    },
    {
      title: 'Manage Seats',
      description: 'Add seats to venues',
      actions: [
        { label: 'Create Seats', path: '/admin/seats/create', icon: 'bi-plus-circle' }
      ]
    },
    {
      title: 'Bookings Management',
      description: 'View and manage all bookings',
      actions: [
        { label: 'View All Bookings', path: '/admin/bookings', icon: 'bi-list' }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Admin Dashboard</h1>
          <span className="badge bg-primary">Administrator</span>
        </div>

        <div className="row">
          {adminActions.map((section, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">{section.title}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{section.description}</p>
                  <div className="d-grid gap-2">
                    {section.actions.map((action, actionIndex) => (
                      <Link
                        key={actionIndex}
                        to={action.path}
                        className="btn btn-outline-primary"
                      >
                        <i className={`bi ${action.icon} me-2`}></i>
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Stats</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="p-3">
                        <h3 className="text-primary">{stats?.totalVenues || 0}</h3>
                        <p className="text-muted mb-0">Total Venues</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h3 className="text-success">{stats?.totalEvents || 0}</h3>
                        <p className="text-muted mb-0">Total Events</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h3 className="text-info">{stats?.totalSeats || 0}</h3>
                        <p className="text-muted mb-0">Total Seats</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h3 className="text-warning">{stats?.activeBookings || 0}</h3>
                        <p className="text-muted mb-0">Active Bookings</p>
                      </div>
                    </div>
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

export default AdminDashboard;