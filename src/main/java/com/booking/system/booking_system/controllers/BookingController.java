package com.booking.system.booking_system.controllers;

import com.booking.system.booking_system.dtos.BookingRequest;
import com.booking.system.booking_system.dtos.BookingResponse;
import com.booking.system.booking_system.services.BookingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@AllArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable Long userId) {
        List<BookingResponse> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByEvent(@PathVariable Long eventId) {
        List<BookingResponse> bookings = bookingService.getBookingsByEventId(eventId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }
}
