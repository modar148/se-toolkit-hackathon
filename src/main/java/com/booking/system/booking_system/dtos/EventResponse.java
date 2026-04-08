package com.booking.system.booking_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDateTime;
    private BigDecimal price;
    private VenueResponse venue;
    private LocalDateTime createdAt;
}
