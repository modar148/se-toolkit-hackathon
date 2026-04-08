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
public class VenueResponse {
    
    private Long id;
    private String name;
    private String location;
    private LocalDateTime createdAt;
}
