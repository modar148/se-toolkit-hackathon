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
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, 
                                          VenueRepository venueRepository,
                                          SeatRepository seatRepository,
                                          EventRepository eventRepository) {
        return args -> {
            // Check if venues already exist
            if (venueRepository.count() == 0) {
                log.info("Initializing sample data...");

                // ===== CREATE USERS =====
                // Create Admin User only if doesn't exist
                User admin = userRepository.findByEmail("admin@eventbooking.com")
                    .orElseGet(() -> {
                        User adminUser = new User();
                        adminUser.setFullName("Admin User");
                        adminUser.setEmail("admin@eventbooking.com");
                        adminUser.setPassword(passwordEncoder.encode("password123"));
                        adminUser.setRole(Role.ADMIN);
                        userRepository.save(adminUser);
                        log.info("Created admin user: admin@eventbooking.com / password123");
                        return adminUser;
                    });

                // Create Regular Users only if they don't exist
                createUserIfNotExists(userRepository, passwordEncoder, "John Doe", "john@example.com", Role.USER);
                createUserIfNotExists(userRepository, passwordEncoder, "Sarah Smith", "sarah@example.com", Role.USER);
                createUserIfNotExists(userRepository, passwordEncoder, "Test User", "user@example.com", Role.USER);

                // ===== CREATE VENUES =====
                Venue venue1 = new Venue();
                venue1.setName("Grand Theater");
                venue1.setLocation("Downtown, Main Street 123");
                venueRepository.save(venue1);
                log.info("Created venue: Grand Theater");

                Venue venue2 = new Venue();
                venue2.setName("City Convention Center");
                venue2.setLocation("Business District, 456 Oak Avenue");
                venueRepository.save(venue2);
                log.info("Created venue: City Convention Center");

                Venue venue3 = new Venue();
                venue3.setName("Sunset Arena");
                venue3.setLocation("West End, 789 Beach Road");
                venueRepository.save(venue3);
                log.info("Created venue: Sunset Arena");

                // ===== CREATE SEATS =====
                // Grand Theater - 3 rows, 10 seats each
                createSeats(seatRepository, venue1, "A", 10);
                createSeats(seatRepository, venue1, "B", 10);
                createSeats(seatRepository, venue1, "C", 10);
                log.info("Created 30 seats for Grand Theater");

                // City Convention Center - 5 rows, 8 seats each
                createSeats(seatRepository, venue2, "A", 8);
                createSeats(seatRepository, venue2, "B", 8);
                createSeats(seatRepository, venue2, "C", 8);
                createSeats(seatRepository, venue2, "D", 8);
                createSeats(seatRepository, venue2, "E", 8);
                log.info("Created 40 seats for City Convention Center");

                // Sunset Arena - 2 rows, 15 seats each
                createSeats(seatRepository, venue3, "A", 15);
                createSeats(seatRepository, venue3, "B", 15);
                log.info("Created 30 seats for Sunset Arena");

                // ===== CREATE EVENTS =====
                LocalDateTime now = LocalDateTime.now();

                Event event1 = new Event();
                event1.setTitle("Rock Concert - The Midnight Band");
                event1.setDescription("An amazing night of rock music with The Midnight Band. Featuring their greatest hits and new album tracks.");
                event1.setEventDateTime(now.plusDays(7).withHour(20).withMinute(0));
                event1.setPrice(new BigDecimal("49.99"));
                event1.setVenue(venue1);
                event1.setCreatedBy(admin);
                eventRepository.save(event1);
                log.info("Created event: Rock Concert");

                Event event2 = new Event();
                event2.setTitle("Tech Conference 2026");
                event2.setDescription("Annual technology conference featuring the latest in AI, cloud computing, and software development.");
                event2.setEventDateTime(now.plusDays(14).withHour(9).withMinute(0));
                event2.setPrice(new BigDecimal("99.00"));
                event2.setVenue(venue2);
                event2.setCreatedBy(admin);
                eventRepository.save(event2);
                log.info("Created event: Tech Conference 2026");

                Event event3 = new Event();
                event3.setTitle("Comedy Night Live");
                event3.setDescription("Stand-up comedy show featuring top comedians from around the country. Get ready for laughs!");
                event3.setEventDateTime(now.plusDays(3).withHour(19).withMinute(30));
                event3.setPrice(new BigDecimal("29.99"));
                event3.setVenue(venue1);
                event3.setCreatedBy(admin);
                eventRepository.save(event3);
                log.info("Created event: Comedy Night Live");

                Event event4 = new Event();
                event4.setTitle("Summer Music Festival");
                event4.setDescription("A full day of music with multiple artists across different genres. Food and drinks available.");
                event4.setEventDateTime(now.plusDays(21).withHour(14).withMinute(0));
                event4.setPrice(new BigDecimal("79.99"));
                event4.setVenue(venue3);
                event4.setCreatedBy(admin);
                eventRepository.save(event4);
                log.info("Created event: Summer Music Festival");

                Event event5 = new Event();
                event5.setTitle("Jazz Evening");
                event5.setDescription("An elegant evening of smooth jazz performed by renowned artists in an intimate setting.");
                event5.setEventDateTime(now.plusDays(10).withHour(18).withMinute(30));
                event5.setPrice(new BigDecimal("59.99"));
                event5.setVenue(venue2);
                event5.setCreatedBy(admin);
                eventRepository.save(event5);
                log.info("Created event: Jazz Evening");

                log.info("Sample data initialized successfully!");
            } else {
                log.info("Data already exists, skipping initialization.");
            }
        };
    }

    private void createSeats(SeatRepository seatRepository, Venue venue, String rowLabel, int count) {
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

    private void createUserIfNotExists(UserRepository userRepository, 
                                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
                                       String fullName, String email, Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(role);
            userRepository.save(user);
            log.info("Created user: " + email + " / password123");
        }
    }
}
