package com.booking.system.booking_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    
    private Long id;
    private String rowLabel;
    private Integer seatNumber;
    private Long venueId;
    private LocalDateTime createdAt;
}
