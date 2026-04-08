import React, { useState, useEffect } from 'react';
import { getEvents, getVenues } from '../api/services';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/shared';
import { useUser } from '../context/UserContext';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [eventsResponse, venuesResponse] = await Promise.all([
        getEvents(),
        getVenues()
      ]);
      const upcomingEvents = eventsResponse.data.sort((a, b) =>
        new Date(a.eventDateTime) - new Date(b.eventDateTime)
      );
      setEvents(upcomingEvents);
      setFilteredEvents(upcomingEvents);
      setVenues(venuesResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Venue filter
    if (selectedVenue) {
      filtered = filtered.filter(event =>
        event.venue?.id.toString() === selectedVenue
      );
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDateTime);
        return eventDate.toDateString() === now.toDateString();
      });
    } else if (dateRange === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDateTime);
        return eventDate >= now && eventDate <= weekFromNow;
      });
    } else if (dateRange === 'month') {
      const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDateTime);
        return eventDate >= now && eventDate <= monthFromNow;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedVenue, dateRange, events]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedVenue('');
    setDateRange('all');
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorState message={error} onRetry={loadEvents} />;

  return (
    <div>
      <h1 className="mb-4">Upcoming Events</h1>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="search" className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="venue" className="form-label">Filter by Venue</label>
              <select
                className="form-select"
                id="venue"
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
              >
                <option value="">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="dateRange" className="form-label">Date Range</label>
              <select
                className="form-select"
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredEvents.length === 0 ? (
        <EmptyState message="No events match your filters" icon="🔍" />
      ) : (
        <div className="row g-4">
          {filteredEvents.map(event => (
            <div key={event.id} className="col-md-6 col-lg-4">
              <EventCard
                event={event}
                isAdmin={user?.role === 'ADMIN'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
