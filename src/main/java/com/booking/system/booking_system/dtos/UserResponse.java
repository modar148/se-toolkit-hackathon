package com.booking.system.booking_system.dtos;

import com.booking.system.booking_system.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
