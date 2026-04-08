import React, { useState, useEffect } from 'react';
import { getVenues } from '../api/services';
import { VenueCard } from '../components/VenueCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/shared';
import { useUser } from '../context/UserContext';

export const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

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

  useEffect(() => {
    loadVenues();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorState message={error} onRetry={loadVenues} />;

  if (venues.length === 0) {
    return <EmptyState message="No venues available yet" icon="🏛️" />;
  }

  return (
    <div>
      <h1 className="mb-4">Venues</h1>
      <div className="row g-4">
        {venues.map(venue => (
          <div key={venue.id} className="col-md-4">
            <VenueCard 
              venue={venue}
              isAdmin={user?.role === 'ADMIN'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
