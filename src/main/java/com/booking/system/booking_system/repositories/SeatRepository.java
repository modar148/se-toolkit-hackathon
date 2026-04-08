package com.booking.system.booking_system.repositories;

import com.booking.system.booking_system.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByVenueId(Long venueId);
    
    Optional<Seat> findByVenueIdAndRowLabelAndSeatNumber(Long venueId, String rowLabel, Integer seatNumber);
}
