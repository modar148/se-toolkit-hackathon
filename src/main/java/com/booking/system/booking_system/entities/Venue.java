package com.booking.system.booking_system.entities;

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
@Table(name = "venues")
public class Venue extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String location;

    @OneToMany(mappedBy = "venue", fetch = FetchType.LAZY)
    private List<Event> events = new ArrayList<>();

    @OneToMany(mappedBy = "venue", fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();
}