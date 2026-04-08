package com.booking.system.booking_system.services;

import com.booking.system.booking_system.dtos.EventRequest;
import com.booking.system.booking_system.dtos.EventResponse;
import com.booking.system.booking_system.entities.Event;

import java.util.List;

public interface EventService {
    EventResponse createEvent(EventRequest request, Long createdByUserId);
    
    EventResponse getEventById(Long eventId);
    
    Event getEventEntityById(Long eventId);
    
    List<EventResponse> getAllEvents();
    
    List<EventResponse> getEventsByVenueId(Long venueId);
    
    EventResponse updateEvent(Long eventId, EventRequest request);
    
    void deleteEvent(Long eventId);
}
