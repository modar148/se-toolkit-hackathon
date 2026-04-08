import React from 'react';
import { Link } from 'react-router-dom';

export const VenueCard = ({ venue, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="card card-hover">
      <div className="card-body">
        <h5 className="card-title">{venue.name}</h5>
        <p className="card-text text-muted">📍 {venue.location}</p>
        <p className="card-text">
          <small className="text-secondary">
            Created {new Date(venue.createdAt).toLocaleDateString()}
          </small>
        </p>
        <Link
          to={`/venues/${venue.id}`}
          className="btn btn-sm btn-primary"
        >
          View Details
        </Link>
        {isAdmin && (
          <>
            <button
              className="btn btn-sm btn-warning ms-2"
              onClick={() => onEdit?.(venue.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger ms-2"
              onClick={() => onDelete?.(venue.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
