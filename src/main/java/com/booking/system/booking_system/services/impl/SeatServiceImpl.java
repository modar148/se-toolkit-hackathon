package com.booking.system.booking_system.services.impl;

import com.booking.system.booking_system.dtos.SeatRequest;
import com.booking.system.booking_system.dtos.SeatResponse;
import com.booking.system.booking_system.entities.Seat;
import com.booking.system.booking_system.entities.Venue;
import com.booking.system.booking_system.exceptions.ResourceNotFoundException;
import com.booking.system.booking_system.repositories.SeatRepository;
import com.booking.system.booking_system.services.SeatService;
import com.booking.system.booking_system.services.VenueService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class SeatServiceImpl implements SeatService {
    
    private final SeatRepository seatRepository;
    private final VenueService venueService;
    
    @Override
    @Transactional
    public SeatResponse createSeat(Long venueId, SeatRequest request) {
        Venue venue = venueService.getVenueEntityById(venueId);
        
        Seat seat = new Seat();
        seat.setRowLabel(request.getRowLabel());
        seat.setSeatNumber(request.getSeatNumber());
        seat.setVenue(venue);
        
        Seat savedSeat = seatRepository.save(seat);
        return mapToResponse(savedSeat);
    }
    
    @Override
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = getSeatEntityById(seatId);
        return mapToResponse(seat);
    }
    
    @Override
    public Seat getSeatEntityById(Long seatId) {
        return seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));
    }
    
    @Override
    public List<SeatResponse> getSeatsByVenueId(Long venueId) {
        venueService.getVenueEntityById(venueId); // Validate venue exists
        return seatRepository.findByVenueId(venueId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    public List<Seat> getSeatEntitiesByIds(List<Long> seatIds) {
        return seatRepository.findAllById(seatIds);
    }
    
    private SeatResponse mapToResponse(Seat seat) {
        SeatResponse response = new SeatResponse();
        response.setId(seat.getId());
        response.setRowLabel(seat.getRowLabel());
        response.setSeatNumber(seat.getSeatNumber());
        response.setVenueId(seat.getVenue().getId());
        response.setCreatedAt(seat.getCreatedAt());
        return response;
    }
}
