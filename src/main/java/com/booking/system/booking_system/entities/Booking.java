package com.booking.system.booking_system.entities;

import com.booking.system.booking_system.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "bookings",
        indexes = {
                @Index(name = "idx_bookings_user_id", columnList = "user_id"),
                @Index(name = "idx_bookings_event_id", columnList = "event_id"),
                @Index(name = "idx_bookings_status", columnList = "status")
        }
)
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.CONFIRMED;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal totalPrice = java.math.BigDecimal.ZERO;

    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookingSeat> bookingSeats = new ArrayList<>();
}