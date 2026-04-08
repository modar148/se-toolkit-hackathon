package com.booking.system.booking_system.services;

import com.booking.system.booking_system.dtos.BookingRequest;
import com.booking.system.booking_system.dtos.BookingResponse;
import com.booking.system.booking_system.entities.Booking;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request);
    
    BookingResponse getBookingById(Long bookingId);
    
    List<BookingResponse> getBookingsByUserId(Long userId);
    
    List<BookingResponse> getBookingsByEventId(Long eventId);
    
    List<BookingResponse> getAllBookings();
    
    BookingResponse cancelBooking(Long bookingId);
}
