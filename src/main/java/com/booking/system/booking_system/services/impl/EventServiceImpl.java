package com.booking.system.booking_system.services.impl;

import com.booking.system.booking_system.dtos.EventRequest;
import com.booking.system.booking_system.dtos.EventResponse;
import com.booking.system.booking_system.dtos.VenueResponse;
import com.booking.system.booking_system.entities.Event;
import com.booking.system.booking_system.entities.User;
import com.booking.system.booking_system.entities.Venue;
import com.booking.system.booking_system.exceptions.ResourceNotFoundException;
import com.booking.system.booking_system.repositories.EventRepository;
import com.booking.system.booking_system.services.EventService;
import com.booking.system.booking_system.services.UserService;
import com.booking.system.booking_system.services.VenueService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {
    
    private final EventRepository eventRepository;
    private final VenueService venueService;
    private final UserService userService;
    
    @Override
    @Transactional
    public EventResponse createEvent(EventRequest request, Long createdByUserId) {
        Venue venue = venueService.getVenueEntityById(request.getVenueId());
        User user = userService.getUserEntityById(createdByUserId);
        
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDateTime(request.getEventDateTime());
        event.setPrice(request.getPrice());
        event.setVenue(venue);
        event.setCreatedBy(user);
            
        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }
    
    @Override
    public EventResponse getEventById(Long eventId) {
        Event event = getEventEntityById(eventId);
        return mapToResponse(event);
    }
    
    @Override
    public Event getEventEntityById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
    }
    
    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    public List<EventResponse> getEventsByVenueId(Long venueId) {
        return eventRepository.findByVenueId(venueId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request) {
        Event event = getEventEntityById(eventId);
        Venue venue = venueService.getVenueEntityById(request.getVenueId());
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDateTime(request.getEventDateTime());
        event.setPrice(request.getPrice());
        event.setVenue(venue);
           
        Event updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }      
           
    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = getEventEntityById(eventId);
        eventRepository.delete(event);
    }       
            
    private EventResponse mapToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setEventDateTime(event.getEventDateTime());
        response.setPrice(event.getPrice());
          
        if (event.getVenue() != null) {
            VenueResponse venueResponse = new VenueResponse();
            venueResponse.setId(event.getVenue().getId());
            venueResponse.setName(event.getVenue().getName());
            venueResponse.setLocation(event.getVenue().getLocation());
            venueResponse.setCreatedAt(event.getVenue().getCreatedAt());
            response.setVenue(venueResponse);
        }
          
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }    
}
