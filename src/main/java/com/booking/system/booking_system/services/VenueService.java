package com.booking.system.booking_system.services;

import com.booking.system.booking_system.dtos.VenueRequest;
import com.booking.system.booking_system.dtos.VenueResponse;
import com.booking.system.booking_system.entities.Venue;

import java.util.List;

public interface VenueService {
    VenueResponse createVenue(VenueRequest request);
    
    VenueResponse getVenueById(Long venueId);
    
    Venue getVenueEntityById(Long venueId);
    
    List<VenueResponse> getAllVenues();
    
    VenueResponse updateVenue(Long venueId, VenueRequest request);
    
    void deleteVenue(Long venueId);
}
