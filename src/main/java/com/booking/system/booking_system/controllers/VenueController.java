package com.booking.system.booking_system.controllers;

import com.booking.system.booking_system.dtos.VenueRequest;
import com.booking.system.booking_system.dtos.VenueResponse;
import com.booking.system.booking_system.services.VenueService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@AllArgsConstructor
public class VenueController {
    
    private final VenueService venueService;
    
    @PostMapping
    public ResponseEntity<VenueResponse> createVenue(@Valid @RequestBody VenueRequest request) {
        VenueResponse response = venueService.createVenue(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        List<VenueResponse> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueById(@PathVariable Long id) {
        VenueResponse response = venueService.getVenueById(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VenueResponse> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequest request) {
        VenueResponse response = venueService.updateVenue(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
