package com.booking.system.booking_system.services;

import com.booking.system.booking_system.dtos.LoginRequest;
import com.booking.system.booking_system.dtos.LoginResponse;
import com.booking.system.booking_system.dtos.UserRegisterRequest;
import com.booking.system.booking_system.dtos.UserResponse;
import com.booking.system.booking_system.entities.User;

public interface UserService {
    UserResponse registerUser(UserRegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getUserById(Long userId);

    User getUserEntityById(Long userId);
}
