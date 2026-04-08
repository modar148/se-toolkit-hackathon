package com.booking.system.booking_system.config;

import com.booking.system.booking_system.entities.Event;
import com.booking.system.booking_system.entities.Seat;
import com.booking.system.booking_system.entities.User;
import com.booking.system.booking_system.entities.Venue;
import com.booking.system.booking_system.enums.Role;
import com.booking.system.booking_system.repositories.EventRepository;
import com.booking.system.booking_system.repositories.SeatRepository;
import com.booking.system.booking_system.repositories.UserRepository;
import com.booking.system.booking_system.repositories.VenueRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@AllArgsConstructor
@Slf4j
public class SampleDataLoader {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;

    @Bean
    public CommandLineRunner loadSampleData() {
        return args -> {
            if (eventRepository.count() > 0) {
                log.info("Events already exist, skipping sample data load.");
                return;
            }

            log.info("Loading sample events and seats...");

            // Get admin user
            User admin = userRepository.findByEmail("admin@eventbooking.com").orElse(null);
            if (admin == null) {
                log.error("Admin user not found!");
                return;
            }

            // Get or create venues
            List<Venue> venues = venueRepository.findAll();
            if (venues.isEmpty()) {
                log.info("No venues found. Please create venues first through the admin panel.");
                return;
            }

            // Create seats for venues that don't have them
            for (Venue venue : venues) {
                List<Seat> existingSeats = seatRepository.findAll().stream()
                    .filter(s -> s.getVenue().getId().equals(venue.getId()))
                    .toList();
                
                if (existingSeats.isEmpty()) {
                    log.info("Creating seats for venue: " + venue.getName());
                    if (venue.getName().contains("Grand Theater")) {
                        createSeats(venue, "A", 10);
                        createSeats(venue, "B", 10);
                        createSeats(venue, "C", 10);
                    } else if (venue.getName().contains("Convention")) {
                        createSeats(venue, "A", 8);
                        createSeats(venue, "B", 8);
                        createSeats(venue, "C", 8);
                        createSeats(venue, "D", 8);
                        createSeats(venue, "E", 8);
                    } else {
                        createSeats(venue, "A", 15);
                        createSeats(venue, "B", 15);
                    }
                }
            }

            // Create events
            LocalDateTime now = LocalDateTime.now();

            if (!venues.isEmpty()) {
                createEvent("Rock Concert - The Midnight Band", 
                    "An amazing night of rock music with The Midnight Band. Featuring their greatest hits and new album tracks.",
                    now.plusDays(7).withHour(20).withMinute(0),
                    new BigDecimal("49.99"), venues.get(0), admin);
            }

            if (venues.size() > 1) {
                createEvent("Tech Conference 2026",
                    "Annual technology conference featuring the latest in AI, cloud computing, and software development.",
                    now.plusDays(14).withHour(9).withMinute(0),
                    new BigDecimal("99.00"), venues.get(1), admin);
            }

            if (!venues.isEmpty()) {
                createEvent("Comedy Night Live",
                    "Stand-up comedy show featuring top comedians from around the country. Get ready for laughs!",
                    now.plusDays(3).withHour(19).withMinute(30),
                    new BigDecimal("29.99"), venues.get(0), admin);
            }

            if (venues.size() > 2) {
                createEvent("Summer Music Festival",
                    "A full day of music with multiple artists across different genres. Food and drinks available.",
                    now.plusDays(21).withHour(14).withMinute(0),
                    new BigDecimal("79.99"), venues.get(2), admin);
            }

            if (venues.size() > 1) {
                createEvent("Jazz Evening",
                    "An elegant evening of smooth jazz performed by renowned artists in an intimate setting.",
                    now.plusDays(10).withHour(18).withMinute(30),
                    new BigDecimal("59.99"), venues.get(1), admin);
            }

            log.info("Sample data loaded successfully! Events: " + eventRepository.count());
        };
    }

    private void createEvent(String title, String description, LocalDateTime dateTime, 
                            BigDecimal price, Venue venue, User createdBy) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setEventDateTime(dateTime);
        event.setPrice(price);
        event.setVenue(venue);
        event.setCreatedBy(createdBy);
        eventRepository.save(event);
        log.info("Created event: " + title);
    }

    private void createSeats(Venue venue, String rowLabel, int count) {
        List<Seat> seats = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            Seat seat = new Seat();
            seat.setRowLabel(rowLabel);
            seat.setSeatNumber(i);
            seat.setVenue(venue);
            seats.add(seat);
        }
        seatRepository.saveAll(seats);
    }
}
