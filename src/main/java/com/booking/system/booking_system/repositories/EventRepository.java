package com.booking.system.booking_system.repositories;

import com.booking.system.booking_system.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByVenueId(Long venueId);
}
