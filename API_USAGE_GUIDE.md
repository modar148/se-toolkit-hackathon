# Event Booking System - API Usage Guide

## Quick Start Example

This guide shows the typical workflow for using the Event Booking System API.

### 1. Register a User

**Endpoint:** `POST /api/users/register`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** (HTTP 201 Created)
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "createdAt": "2026-04-05T10:30:00"
}
```

### 2. Create a Venue

**Endpoint:** `POST /api/venues`

**Request:**
```json
{
  "name": "Grand Theater",
  "location": "123 Main Street, Downtown"
}
```

**Response:** (HTTP 201 Created)
```json
{
  "id": 1,
  "name": "Grand Theater",
  "location": "123 Main Street, Downtown",
  "createdAt": "2026-04-05T10:35:00"
}
```

### 3. Create Seats for the Venue

**Endpoint:** `POST /api/venues/1/seats`

**Request:** (Create multiple seats)
```json
{
  "rowLabel": "A",
  "seatNumber": 1
}
```

**Response:** (HTTP 201 Created)
```json
{
  "id": 101,
  "rowLabel": "A",
  "seatNumber": 1,
  "venueId": 1,
  "createdAt": "2026-04-05T10:40:00"
}
```

Repeat to create more seats: A2, A3, B1, B2, etc.

### 4. Create an Event

**Endpoint:** `POST /api/events?createdByUserId=1`

**Request:**
```json
{
  "title": "Concert Night",
  "description": "An amazing concert featuring popular artists",
  "eventDateTime": "2026-05-15T19:00:00",
  "price": 50.00,
  "venueId": 1
}
```

**Response:** (HTTP 201 Created)
```json
{
  "id": 1,
  "title": "Concert Night",
  "description": "An amazing concert featuring popular artists",
  "eventDateTime": "2026-05-15T19:00:00",
  "price": 50.00,
  "venue": {
    "id": 1,
    "name": "Grand Theater",
    "location": "123 Main Street, Downtown",
    "createdAt": "2026-04-05T10:35:00"
  },
  "createdAt": "2026-04-05T10:45:00"
}
```

### 5. Book Seats for an Event

**Endpoint:** `POST /api/bookings`

**Request:**
```json
{
  "userId": 1,
  "eventId": 1,
  "seatIds": [101, 102, 103]
}
```

**Response:** (HTTP 201 Created)
```json
{
  "id": 1,
  "userId": 1,
  "eventId": 1,
  "status": "CONFIRMED",
  "seats": [
    {
      "id": 101,
      "rowLabel": "A",
      "seatNumber": 1,
      "venueId": 1,
      "createdAt": "2026-04-05T10:40:00"
    },
    {
      "id": 102,
      "rowLabel": "A",
      "seatNumber": 2,
      "venueId": 1,
      "createdAt": "2026-04-05T10:40:00"
    },
    {
      "id": 103,
      "rowLabel": "A",
      "seatNumber": 3,
      "venueId": 1,
      "createdAt": "2026-04-05T10:40:00"
    }
  ],
  "createdAt": "2026-04-05T10:50:00"
}
```

### 6. Get User's Bookings

**Endpoint:** `GET /api/bookings/user/1`

**Response:** (HTTP 200 OK)
```json
[
  {
    "id": 1,
    "userId": 1,
    "eventId": 1,
    "status": "CONFIRMED",
    "seats": [...],
    "createdAt": "2026-04-05T10:50:00"
  }
]
```

### 7. Cancel a Booking

**Endpoint:** `PATCH /api/bookings/1/cancel`

**Response:** (HTTP 200 OK)
```json
{
  "id": 1,
  "userId": 1,
  "eventId": 1,
  "status": "CANCELLED",
  "seats": [
    {
      "id": 101,
      "rowLabel": "A",
      "seatNumber": 1,
      "venueId": 1,
      "createdAt": "2026-04-05T10:40:00"
    },
    ...
  ],
  "createdAt": "2026-04-05T10:50:00"
}
```

## Admin Operations

### List All Bookings (Admin)

**Endpoint:** `GET /api/bookings`

**Response:** (HTTP 200 OK)
```json
[
  {
    "id": 1,
    "userId": 1,
    "eventId": 1,
    "status": "CONFIRMED",
    "seats": [...],
    "createdAt": "2026-04-05T10:50:00"
  },
  {
    "id": 2,
    "userId": 2,
    "eventId": 1,
    "status": "CONFIRMED",
    "seats": [...],
    "createdAt": "2026-04-05T11:00:00"
  }
]
```

### Get Bookings for an Event

**Endpoint:** `GET /api/bookings/event/1`

**Response:** Same as above, filtered by eventId

### Get All Venues

**Endpoint:** `GET /api/venues`

**Response:** (HTTP 200 OK)
```json
[
  {
    "id": 1,
    "name": "Grand Theater",
    "location": "123 Main Street, Downtown",
    "createdAt": "2026-04-05T10:35:00"
  }
]
```

### Get Events by Venue

**Endpoint:** `GET /api/events/venue/1`

**Response:** (HTTP 200 OK)
```json
[
  {
    "id": 1,
    "title": "Concert Night",
    "description": "An amazing concert featuring popular artists",
    "eventDateTime": "2026-05-15T19:00:00",
    "price": 50.00,
    "venue": {
      "id": 1,
      "name": "Grand Theater",
      "location": "123 Main Street, Downtown",
      "createdAt": "2026-04-05T10:35:00"
    },
    "createdAt": "2026-04-05T10:45:00"
  }
]
```

### Get Seats for a Venue

**Endpoint:** `GET /api/venues/1/seats`

**Response:** (HTTP 200 OK)
```json
[
  {
    "id": 101,
    "rowLabel": "A",
    "seatNumber": 1,
    "venueId": 1,
    "createdAt": "2026-04-05T10:40:00"
  },
  {
    "id": 102,
    "rowLabel": "A",
    "seatNumber": 2,
    "venueId": 1,
    "createdAt": "2026-04-05T10:40:00"
  }
]
```

## Error Handling

### Resource Not Found

**Status:** 404 Not Found

**Response:**
```json
{
  "status": 404,
  "message": "User not found with id: 999",
  "error": "Not Found",
  "timestamp": "2026-04-05T10:55:00",
  "path": "/api/users/999",
  "fieldErrors": null
}
```

### Validation Error

**Status:** 400 Bad Request

**Response:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "Validation Error",
  "timestamp": "2026-04-05T10:55:00",
  "path": "/api/bookings",
  "fieldErrors": {
    "userId": "User ID is required",
    "eventId": "Event ID is required",
    "seatIds": "At least one seat must be selected"
  }
}
```

### Seat Already Booked

**Status:** 409 Conflict

**Response:**
```json
{
  "status": 409,
  "message": "One or more requested seats are already booked for this event",
  "error": "Seat Already Booked",
  "timestamp": "2026-04-05T10:55:00",
  "path": "/api/bookings",
  "fieldErrors": null
}
```

### Invalid Booking State

**Status:** 400 Bad Request

**Response:**
```json
{
  "status": 400,
  "message": "Booking is already cancelled",
  "error": "Invalid Booking",
  "timestamp": "2026-04-05T10:55:00",
  "path": "/api/bookings/1/cancel",
  "fieldErrors": null
}
```

## Important Notes

1. **Email Uniqueness:** Attempting to register with an existing email returns 400 Bad Request
2. **Future Events Only:** Event date/time must be in the future
3. **Seat Belonging:** All requested seats must belong to the event's venue
4. **Double Booking Prevention:** The system prevents double booking at both application and database level
5. **Booking Immutability:** Once created, bookings cannot be modified - only cancelled
6. **Cancellation:** Cancelled bookings remain in the database for audit purposes and seats become available
7. **Numeric IDs:** All IDs are auto-generated Long values starting from 1

