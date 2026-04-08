package com.booking.system.booking_system.repositories;

import com.booking.system.booking_system.entities.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByEventIdAndSeatId(Long eventId, Long seatId);
    
    List<BookingSeat> findByBookingId(Long bookingId);
    
    List<BookingSeat> findByEventId(Long eventId);
    
    @Query("SELECT bs FROM BookingSeat bs WHERE bs.event.id = :eventId AND bs.seat.id IN (:seatIds)")
    List<BookingSeat> findByEventIdAndSeatIds(Long eventId, List<Long> seatIds);
}
