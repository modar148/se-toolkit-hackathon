package com.booking.system.booking_system.services;

import com.booking.system.booking_system.dtos.SeatRequest;
import com.booking.system.booking_system.dtos.SeatResponse;
import com.booking.system.booking_system.entities.Seat;

import java.util.List;

public interface SeatService {
    SeatResponse createSeat(Long venueId, SeatRequest request);
    
    SeatResponse getSeatById(Long seatId);
    
    Seat getSeatEntityById(Long seatId);
    
    List<SeatResponse> getSeatsByVenueId(Long venueId);
    
    List<Seat> getSeatEntitiesByIds(List<Long> seatIds);
}
