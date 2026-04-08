package com.booking.system.booking_system.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "events",
        indexes = {
                @Index(name = "idx_events_venue_id", columnList = "venue_id"),
                @Index(name = "idx_events_event_date_time", columnList = "event_date_time")
        }
)
public class Event extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "event_date_time", nullable = false)
    private LocalDateTime eventDateTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY)
    private List<BookingSeat> bookingSeats = new ArrayList<>();
}
