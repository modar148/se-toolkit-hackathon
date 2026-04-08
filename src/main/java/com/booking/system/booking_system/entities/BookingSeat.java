package com.booking.system.booking_system.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "booking_seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_booking_seat",
                        columnNames = {"booking_id", "seat_id"}
                ),
                @UniqueConstraint(
                        name = "uk_event_seat",
                        columnNames = {"event_id", "seat_id"}
                )
        },
        indexes = {
                @Index(name = "idx_booking_seats_booking_id", columnList = "booking_id"),
                @Index(name = "idx_booking_seats_event_id", columnList = "event_id"),
                @Index(name = "idx_booking_seats_seat_id", columnList = "seat_id")
        }
)
public class BookingSeat extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}