package com.booking.system.booking_system.repositories;

import com.booking.system.booking_system.entities.Booking;
import com.booking.system.booking_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByEventId(Long eventId);
    
    long countByStatus(Status status);
}
