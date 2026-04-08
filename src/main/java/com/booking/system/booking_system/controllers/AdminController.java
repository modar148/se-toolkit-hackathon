package com.booking.system.booking_system.controllers;

import com.booking.system.booking_system.dtos.StatsResponse;
import com.booking.system.booking_system.enums.Status;
import com.booking.system.booking_system.repositories.BookingRepository;
import com.booking.system.booking_system.repositories.EventRepository;
import com.booking.system.booking_system.repositories.SeatRepository;
import com.booking.system.booking_system.repositories.VenueRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        StatsResponse stats = new StatsResponse();
        stats.setTotalVenues(venueRepository.count());
        stats.setTotalEvents(eventRepository.count());
        stats.setTotalSeats(seatRepository.count());
        stats.setActiveBookings(bookingRepository.countByStatus(Status.CONFIRMED));
        stats.setCancelledBookings(bookingRepository.countByStatus(Status.CANCELLED));
        return ResponseEntity.ok(stats);
    }
}
