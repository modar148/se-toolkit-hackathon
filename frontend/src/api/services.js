import apiClient from './axios';

// User API
export const registerUser = (fullName, email, password) =>
  apiClient.post('/users/register', { fullName, email, password });

export const loginUser = (email, password) =>
  apiClient.post('/users/login', { email, password });

export const getUserById = (userId) =>
  apiClient.get(`/users/${userId}`);

// Venue API
export const getVenues = () =>
  apiClient.get('/venues');

export const getVenueById = (venueId) =>
  apiClient.get(`/venues/${venueId}`);

export const createVenue = (name, location) =>
  apiClient.post('/venues', { name, location });

export const updateVenue = (venueId, name, location) =>
  apiClient.put(`/venues/${venueId}`, { name, location });

export const deleteVenue = (venueId) =>
  apiClient.delete(`/venues/${venueId}`);

// Event API
export const getEvents = () =>
  apiClient.get('/events');

export const getEventById = (eventId) =>
  apiClient.get(`/events/${eventId}`);

export const getEventsByVenue = (venueId) =>
  apiClient.get(`/events/venue/${venueId}`);

export const createEvent = (title, description, eventDateTime, price, venueId, createdByUserId) =>
  apiClient.post('/events', { title, description, eventDateTime, price, venueId }, {
    params: { createdByUserId }
  });

export const updateEvent = (eventId, title, description, eventDateTime, price, venueId) =>
  apiClient.put(`/events/${eventId}`, { title, description, eventDateTime, price, venueId });

export const deleteEvent = (eventId) =>
  apiClient.delete(`/events/${eventId}`);

// Seat API
export const getSeatsByVenue = (venueId) =>
  apiClient.get(`/venues/${venueId}/seats`);

export const createSeat = (venueId, rowLabel, seatNumber) =>
  apiClient.post(`/venues/${venueId}/seats`, { rowLabel, seatNumber });

// Booking API
export const createBooking = (userId, eventId, seatIds) =>
  apiClient.post('/bookings', { userId, eventId, seatIds });

export const getBookingById = (bookingId) =>
  apiClient.get(`/bookings/${bookingId}`);

export const getBookingsByUser = (userId) =>
  apiClient.get(`/bookings/user/${userId}`);

export const getBookingsByEvent = (eventId) =>
  apiClient.get(`/bookings/event/${eventId}`);

export const getAllBookings = () =>
  apiClient.get('/bookings');

export const cancelBooking = (bookingId) =>
  apiClient.patch(`/bookings/${bookingId}/cancel`);

// Admin API
export const getAdminStats = () =>
  apiClient.get('/admin/stats');

export default {
  registerUser,
  getUserById,
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getEvents,
  getEventById,
  getEventsByVenue,
  createEvent,
  updateEvent,
  deleteEvent,
  getSeatsByVenue,
  createSeat,
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByEvent,
  getAllBookings,
  cancelBooking,
};
