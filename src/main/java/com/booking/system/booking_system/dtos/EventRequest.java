package com.booking.system.booking_system.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class EventRequest {
    
    @NotBlank(message = "Event title is required")
    private String title;
    
    @NotBlank(message = "Event description is required")
    private String description;
    
    @NotNull(message = "Event date and time is required")
    @Future(message = "Event date must be in the future")
    private LocalDateTime eventDateTime;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @NotNull(message = "Venue ID is required")
    private Long venueId;
}
