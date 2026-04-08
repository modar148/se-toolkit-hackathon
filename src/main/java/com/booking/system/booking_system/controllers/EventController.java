package com.booking.system.booking_system.controllers;

import com.booking.system.booking_system.dtos.EventRequest;
import com.booking.system.booking_system.dtos.EventResponse;
import com.booking.system.booking_system.services.EventService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@AllArgsConstructor
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            @RequestParam Long createdByUserId) {
        EventResponse response = eventService.createEvent(request, createdByUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        EventResponse response = eventService.getEventById(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<EventResponse>> getEventsByVenueId(@PathVariable Long venueId) {
        List<EventResponse> events = eventService.getEventsByVenueId(venueId);
        return ResponseEntity.ok(events);
    }
}
