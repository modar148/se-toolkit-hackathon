package com.booking.system.booking_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private long totalVenues;
    private long totalEvents;
    private long totalSeats;
    private long activeBookings;
    private long cancelledBookings;
}
