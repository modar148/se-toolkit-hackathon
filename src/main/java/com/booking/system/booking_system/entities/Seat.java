package com.booking.system.booking_system.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
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
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_seat_venue_row_number",
                        columnNames = {"venue_id", "row_label", "seat_number"}
                )
        },
        indexes = {
                @Index(name = "idx_seats_venue_id", columnList = "venue_id")
        }
)
public class Seat extends BaseEntity {

    @Column(name = "row_label", nullable = false, length = 20)
    private String rowLabel;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @OneToMany(mappedBy = "seat", fetch = FetchType.LAZY)
    private List<BookingSeat> bookingSeats = new ArrayList<>();
}