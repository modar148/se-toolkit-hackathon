package com.booking.system.booking_system.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequest {
    
    @NotNull(message = "Row label is required")
    private String rowLabel;
    
    @NotNull(message = "Seat number is required")
    @Positive(message = "Seat number must be positive")
    private Integer seatNumber;
}
