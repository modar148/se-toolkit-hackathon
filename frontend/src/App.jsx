import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Venues } from './pages/Venues';
import { VenueDetails } from './pages/VenueDetails';
import { Events } from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminVenues from './pages/AdminVenues';
import AdminCreateVenue from './pages/AdminCreateVenue';
import AdminEditVenue from './pages/AdminEditVenue';
import AdminEvents from './pages/AdminEvents';
import AdminCreateEvent from './pages/AdminCreateEvent';
import AdminEditEvent from './pages/AdminEditEvent';
import AdminSeats from './pages/AdminSeats';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:venueId" element={<VenueDetails />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/venues" element={<AdminVenues />} />
      <Route path="/admin/venues/create" element={<AdminCreateVenue />} />
      <Route path="/admin/venues/:venueId/edit" element={<AdminEditVenue />} />
      <Route path="/admin/venues/:venueId/seats" element={<AdminSeats />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/events/create" element={<AdminCreateEvent />} />
      <Route path="/admin/events/:eventId/edit" element={<AdminEditEvent />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
    </Routes>
  );
}

export default App;