# Event Booking System - Backend Implementation

## Summary

This document provides a comprehensive overview of the Event Booking System backend implementation, which includes a complete service layer and REST APIs built on top of existing entities.

## Project Structure

```
src/
├── main/java/com/booking/system/booking_system/
│   ├── BookingSystemApplication.java          # Main Spring Boot application
│   ├── entities/                              # JPA entities (already existed)
│   ├── enums/                                 # Enums (Role, Status)
│   ├── repositories/                          # Repository interfaces for data access
│   ├── services/                              # Service interfaces
│   ├── services/impl/                         # Service implementations
│   ├── controllers/                           # REST controllers
│   ├── dtos/                                  # Data Transfer Objects
│   ├── exceptions/                            # Custom exception classes
│   └── config/                                # Configuration classes
```

## Components Created

### 1. Repository Interfaces (`repositories/`)

All repositories extend `JpaRepository` for basic CRUD operations and custom queries:

- **UserRepository**: `findByEmail(String email)` - for duplicate email checks
- **VenueRepository**: Basic CRUD operations
- **EventRepository**: `findByVenueId(Long venueId)` - list events by venue
- **SeatRepository**: `findByVenueId()`, `findByVenueIdAndRowLabelAndSeatNumber()` - seat lookups
- **BookingRepository**: `findByUserId()`, `findByEventId()` - booking queries
- **BookingSeatRepository**: Helper queries for booking-seat associations with unique constraint enforcement

### 2. Custom Exceptions (`exceptions/`)

- **ResourceNotFoundException**: Thrown when entity is not found (HTTP 404)
- **BadRequestException**: Thrown for invalid requests (HTTP 400)
- **SeatAlreadyBookedException**: Thrown when seat is already booked (HTTP 409 Conflict)
- **InvalidBookingException**: Thrown for invalid booking operations (HTTP 400)

### 3. DTOs (Data Transfer Objects) (`dtos/`)

Request/Response pairs for clean API contracts:

- **UserRegisterRequest / UserResponse**: User registration and profile
- **VenueRequest / VenueResponse**: Venue management
- **EventRequest / EventResponse**: Event management (nested VenueResponse)
- **SeatRequest / SeatResponse**: Seat management
- **BookingRequest / BookingResponse**: Booking creation and retrieval (includes seat list)
- **ErrorResponse**: Standardized error messages with field-level validation errors

### 4. Services (`services/` and `services/impl/`)

**Service Interfaces:**
- UserService, VenueService, EventService, SeatService, BookingService

**Key Service Implementations:**

#### UserServiceImpl
- User registration with email uniqueness validation
- Password security note: Currently plain text - should be encrypted in production
- User retrieval by ID

#### VenueServiceImpl
- Full CRUD operations for venues
- Transactional boundaries on create/update/delete operations

#### EventServiceImpl
- Create events linked to venues and users
- Automatic venue validation
- Date validation (future dates only via @Future annotation)
- List events by venue

#### SeatServiceImpl
- Create seats for venues with row and seat number
- Support for seat layout retrieval
- Unique constraint: (venue_id, row_label, seat_number)

#### BookingServiceImpl (Core Business Logic)
- **Booking Creation** (@Transactional):
  - Validates user existence
  - Validates event existence
  - Validates all seats exist and belong to event's venue
  - Checks for double booking using BookingSeat unique constraint
  - Creates booking with CONFIRMED status
  - Creates booking-seat associations atomically
  - Throws SeatAlreadyBookedException if any seat is already booked for that event

- **Booking Cancellation** (@Transactional):
  - Validates booking exists
  - Prevents double cancellation
  - Sets status to CANCELLED
  - Removes booking-seat associations (orphanRemoval = true in entity)
  - Releases seats by deleting booking records

- **Booking Queries**:
  - Get by ID
  - Get by user (with automatic user validation)
  - Get by event (with automatic event validation)
  - Get all bookings (for admin)

### 5. REST Controllers (`controllers/`)

#### UserController (`/api/users`)
- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user profile

#### VenueController (`/api/venues`)
- `POST /api/venues` - Create venue
- `GET /api/venues` - List all venues
- `GET /api/venues/{id}` - Get venue by ID
- `PUT /api/venues/{id}` - Update venue
- `DELETE /api/venues/{id}` - Delete venue

#### EventController (`/api/events`)
- `POST /api/events?createdByUserId={userId}` - Create event
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event by ID
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /api/events/venue/{venueId}` - List events by venue

#### SeatController (`/api/venues/{venueId}/seats`)
- `POST /api/venues/{venueId}/seats` - Create seat for venue
- `GET /api/venues/{venueId}/seats` - List seats by venue
- `GET /api/venues/{venueId}/seats/{seatId}` - Get seat by ID

#### BookingController (`/api/bookings`)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/user/{userId}` - Get bookings by user
- `GET /api/bookings/event/{eventId}` - Get bookings by event
- `GET /api/bookings` - Get all bookings (admin)
- `PATCH /api/bookings/{id}/cancel` - Cancel booking

### 6. Global Exception Handler (`config/GlobalExceptionHandler.java`)

Centralized exception handling with `@ControllerAdvice`:
- Catches all custom exceptions
- Validates request DTOs with field-level error messages
- Standardized ErrorResponse for all errors
- Proper HTTP status codes (404, 400, 409, 500)
- Includes request path, timestamp, and detailed error messages

### 7. Validation

Uses `jakarta.validation` annotations on DTOs:
- `@NotBlank` - Required string fields
- `@Email` - Email format validation
- `@NotNull` - Required fields
- `@Future` - Event dates must be in the future
- `@DecimalMin` - Price must be positive
- `@Positive` - Seat numbers must be positive
- `@NotEmpty` - Booking must have at least one seat
- `@Valid` - Cascade validation to nested objects

## Database Constraints

The following database constraints are enforced via entities and repositories:

1. **Double Booking Prevention**:
   - Unique constraint on BookingSeat: (event_id, seat_id)
   - Application-level check in BookingServiceImpl.createBooking()

2. **Seat Uniqueness**:
   - Unique constraint on Seat: (venue_id, row_label, seat_number)

3. **Referential Integrity**:
   - Foreign keys on all relationships
   - Cascade delete behavior configured in entities

## Transaction Management

- `@Transactional` applied to:
  - All service methods that modify state (create, update, delete, cancel)
  - Booking creation (ensures atomic booking + booking-seat creation)
  - Booking cancellation (ensures atomic status update + seat release)

## Architecture

```
Controller
    ↓ (receives requests, validates using @Valid)
Service Layer
    ↓ (business logic, transactions)
Repository Layer
    ↓ (database access)
Database
```

## Key Design Decisions

1. **No Password Encryption**: Currently storing passwords in plain text. Production implementation should use BCryptPasswordEncoder or similar.

2. **CONFIRMED Status on Booking**: Bookings are created with CONFIRMED status. This can be changed to PENDING if email confirmation workflow is needed.

3. **Soft Delete on Cancellation**: Cancelled bookings remain in database for audit trail. Not physically deleted.

4. **DTO Mapping**: Manual mapping in service layer allows for flexibility. Could be enhanced with MapStruct for large projects.

5. **No Authentication/Authorization**: The current implementation is simplified. Production systems should add Spring Security filters for role-based access control.

6. **Bookings are Immutable**: Once created, bookings cannot be modified, only cancelled. New booking required for different seats.

## Assumptions & Limitations

1. One user = one email (enforced via unique constraint)
2. Events are always in the future (validated via @Future)
3. Seats cannot be moved between venues
4. Once a booking is cancelled, those seats become available for rebooking
5. No inventory management for future enhancements
6. No reporting or analytics endpoints
7. No API versioning
8. No pagination on list endpoints (MVP design)

## Next Steps for Enhancement

1. Add Spring Security with JWT authentication
2. Encrypt passwords using BCryptPasswordEncoder
3. Add pagination to list endpoints
4. Add auditing with @CreatedBy, @LastModifiedBy, @LastModifiedDate
5. Add API documentation with Swagger/OpenAPI
6. Add more sophisticated event filtering and search
7. Add booking status transitions (PENDING → CONFIRMED → CHECKED_IN)
8. Add payment processing integration
9. Add email notifications
10. Add seating optimizations and recommendations

## Technologies Used

- **Framework**: Spring Boot 4.0.5
- **Language**: Java 21
- **Database**: MySQL
- **ORM**: JPA/Hibernate
- **Validation**: Jakarta Validation API
- **Build Tool**: Maven
- **Logging**: SLF4J (configured via Spring Boot)
- **Annotations**: Lombok (to reduce boilerplate)

## Files Created

### Repositories (6 files)
- UserRepository.java
- VenueRepository.java
- EventRepository.java
- SeatRepository.java
- BookingRepository.java
- BookingSeatRepository.java

### Exceptions (4 files)
- ResourceNotFoundException.java
- BadRequestException.java
- SeatAlreadyBookedException.java
- InvalidBookingException.java

### DTOs (11 files)
- UserRegisterRequest.java
- UserResponse.java
- VenueRequest.java
- VenueResponse.java
- EventRequest.java
- EventResponse.java
- SeatRequest.java
- SeatResponse.java
- BookingRequest.java
- BookingResponse.java
- ErrorResponse.java

### Services (5 interface files)
- UserService.java
- VenueService.java
- EventService.java
- SeatService.java
- BookingService.java

### Service Implementations (5 files)
- UserServiceImpl.java
- VenueServiceImpl.java
- EventServiceImpl.java
- SeatServiceImpl.java
- BookingServiceImpl.java

### Controllers (5 files)
- UserController.java
- VenueController.java
- EventController.java
- SeatController.java
- BookingController.java

### Configuration (1 file)
- GlobalExceptionHandler.java

### Modified Files
- pom.xml (added spring-boot-starter-validation)
- Status.java (added PENDING status)

**Total: 45 new files + 2 modified files**

