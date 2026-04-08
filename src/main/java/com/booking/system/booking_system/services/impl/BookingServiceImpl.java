package com.booking.system.booking_system.services.impl;

import com.booking.system.booking_system.dtos.BookingRequest;
import com.booking.system.booking_system.dtos.BookingResponse;
import com.booking.system.booking_system.dtos.SeatResponse;
import com.booking.system.booking_system.entities.Booking;
import com.booking.system.booking_system.entities.BookingSeat;
import com.booking.system.booking_system.entities.Event;
import com.booking.system.booking_system.entities.Seat;
import com.booking.system.booking_system.entities.User;
import com.booking.system.booking_system.enums.Status;
import com.booking.system.booking_system.exceptions.BadRequestException;
import com.booking.system.booking_system.exceptions.InvalidBookingException;
import com.booking.system.booking_system.exceptions.ResourceNotFoundException;
import com.booking.system.booking_system.exceptions.SeatAlreadyBookedException;
import com.booking.system.booking_system.repositories.BookingRepository;
import com.booking.system.booking_system.repositories.BookingSeatRepository;
import com.booking.system.booking_system.services.BookingService;
import com.booking.system.booking_system.services.EventService;
import com.booking.system.booking_system.services.SeatService;
import com.booking.system.booking_system.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final UserService userService;
    private final EventService eventService;
    private final SeatService seatService;
    
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Validate user exists
        User user = userService.getUserEntityById(request.getUserId());
        
        // Validate event exists
        Event event = eventService.getEventEntityById(request.getEventId());
        
        // Validate and fetch seats
        List<Seat> requestedSeats = seatService.getSeatEntitiesByIds(request.getSeatIds());
        
        if (requestedSeats.isEmpty()) {
            throw new BadRequestException("No seats found with provided IDs");
        }
        
        if (requestedSeats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Some requested seats do not exist");
        }
        
        // Verify all seats belong to the same venue as the event
        Long eventVenueId = event.getVenue().getId();
        for (Seat seat : requestedSeats) {
            if (!seat.getVenue().getId().equals(eventVenueId)) {
                throw new BadRequestException("Seat does not belong to the event's venue");
            }
        }
        
        // Check if seats are already booked for this event
        List<BookingSeat> existingBookings = bookingSeatRepository
                .findByEventIdAndSeatIds(event.getId(), request.getSeatIds());
        
        if (!existingBookings.isEmpty()) {
            throw new SeatAlreadyBookedException("One or more requested seats are already booked for this event");
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setStatus(Status.CONFIRMED);
        
        // Calculate total price (event price * number of seats)
        java.math.BigDecimal totalPrice = event.getPrice().multiply(java.math.BigDecimal.valueOf(requestedSeats.size()));
        booking.setTotalPrice(totalPrice);

        Booking savedBooking = bookingRepository.save(booking);
        
        // Create booking-seat associations
        for (Seat seat : requestedSeats) {
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setSeat(seat);
            bookingSeat.setEvent(event);
            bookingSeatRepository.save(bookingSeat);
        }
        
        return mapToResponse(savedBooking);
    }
    
    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return mapToResponse(booking);
    }
    
    @Override
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        userService.getUserEntityById(userId); // Validate user exists
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    public List<BookingResponse> getBookingsByEventId(Long eventId) {
        eventService.getEventEntityById(eventId); // Validate event exists
        return bookingRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() == Status.CANCELLED) {
            throw new InvalidBookingException("Booking is already cancelled");
        }
        
        booking.setStatus(Status.CANCELLED);
        
        // Remove booking-seat associations (orphanRemoval is set to true in entity)
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(bookingId);
        bookingSeatRepository.deleteAll(bookingSeats);
        
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }
    
    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUser().getId());
        response.setEventId(booking.getEvent().getId());
        response.setEventTitle(booking.getEvent().getTitle());
        response.setStatus(booking.getStatus());
        response.setTotalPrice(booking.getTotalPrice());
        response.setCreatedAt(booking.getCreatedAt());

        // Fetch associated seats
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(booking.getId());
        List<SeatResponse> seatResponses = bookingSeats.stream()
                .map(bs -> {
                    Seat seat = bs.getSeat();
                    SeatResponse seatResponse = new SeatResponse();
                    seatResponse.setId(seat.getId());
                    seatResponse.setRowLabel(seat.getRowLabel());
                    seatResponse.setSeatNumber(seat.getSeatNumber());
                    seatResponse.setVenueId(seat.getVenue().getId());
                    seatResponse.setCreatedAt(seat.getCreatedAt());
                    return seatResponse;
                })
                .toList();

        response.setSeats(seatResponses);
        return response;
    }
}
