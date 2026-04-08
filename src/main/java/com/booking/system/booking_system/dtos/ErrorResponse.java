package com.booking.system.booking_system.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> fieldErrors;
}
