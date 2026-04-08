package com.booking.system.booking_system.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueRequest {
    
    @NotBlank(message = "Venue name is required")
    private String name;
    
    @NotBlank(message = "Location is required")
    private String location;
}
