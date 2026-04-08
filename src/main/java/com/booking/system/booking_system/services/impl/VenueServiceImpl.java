package com.booking.system.booking_system.services.impl;

import com.booking.system.booking_system.dtos.VenueRequest;
import com.booking.system.booking_system.dtos.VenueResponse;
import com.booking.system.booking_system.entities.Venue;
import com.booking.system.booking_system.exceptions.ResourceNotFoundException;
import com.booking.system.booking_system.repositories.VenueRepository;
import com.booking.system.booking_system.services.VenueService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class VenueServiceImpl implements VenueService {
    
    private final VenueRepository venueRepository;
    
    @Override
    @Transactional
    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = new Venue();
        venue.setName(request.getName());
        venue.setLocation(request.getLocation());
        
        Venue savedVenue = venueRepository.save(venue);
        return mapToResponse(savedVenue);
    }
    
    @Override
    public VenueResponse getVenueById(Long venueId) {
        Venue venue = getVenueEntityById(venueId);
        return mapToResponse(venue);
    }
    
    @Override
    public Venue getVenueEntityById(Long venueId) {
        return venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));
    }
    
    @Override
    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional
    public VenueResponse updateVenue(Long venueId, VenueRequest request) {
        Venue venue = getVenueEntityById(venueId);
        venue.setName(request.getName());
        venue.setLocation(request.getLocation());
        
        Venue updatedVenue = venueRepository.save(venue);
        return mapToResponse(updatedVenue);
    }
    
    @Override
    @Transactional
    public void deleteVenue(Long venueId) {
        Venue venue = getVenueEntityById(venueId);
        venueRepository.delete(venue);
    }
    
    private VenueResponse mapToResponse(Venue venue) {
        VenueResponse response = new VenueResponse();
        response.setId(venue.getId());
        response.setName(venue.getName());
        response.setLocation(venue.getLocation());
        response.setCreatedAt(venue.getCreatedAt());
        return response;
    }
}
