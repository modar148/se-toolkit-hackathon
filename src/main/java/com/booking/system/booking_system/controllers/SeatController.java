package com.booking.system.booking_system.controllers;

import com.booking.system.booking_system.dtos.SeatRequest;
import com.booking.system.booking_system.dtos.SeatResponse;
import com.booking.system.booking_system.services.SeatService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues/{venueId}/seats")
@AllArgsConstructor
public class SeatController {
    
    private final SeatService seatService;
    
    @PostMapping
    public ResponseEntity<SeatResponse> createSeat(
            @PathVariable Long venueId,
            @Valid @RequestBody SeatRequest request) {
        SeatResponse response = seatService.createSeat(venueId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<SeatResponse>> getSeatsByVenue(@PathVariable Long venueId) {
        List<SeatResponse> seats = seatService.getSeatsByVenueId(venueId);
        return ResponseEntity.ok(seats);
    }
    
    @GetMapping("/{seatId}")
    public ResponseEntity<SeatResponse> getSeatById(
            @PathVariable Long venueId,
            @PathVariable Long seatId) {
        SeatResponse response = seatService.getSeatById(seatId);
        return ResponseEntity.ok(response);
    }
}
