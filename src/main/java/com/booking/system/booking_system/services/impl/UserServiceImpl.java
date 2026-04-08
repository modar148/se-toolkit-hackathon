package com.booking.system.booking_system.services.impl;

import com.booking.system.booking_system.dtos.LoginRequest;
import com.booking.system.booking_system.dtos.LoginResponse;
import com.booking.system.booking_system.dtos.UserRegisterRequest;
import com.booking.system.booking_system.dtos.UserResponse;
import com.booking.system.booking_system.entities.User;
import com.booking.system.booking_system.enums.Role;
import com.booking.system.booking_system.exceptions.BadRequestException;
import com.booking.system.booking_system.exceptions.ResourceNotFoundException;
import com.booking.system.booking_system.repositories.UserRepository;
import com.booking.system.booking_system.security.JwtUtil;
import com.booking.system.booking_system.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    public UserResponse registerUser(UserRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Build response
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(mapToResponse(user));
        return response;
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = getUserEntityById(userId);
        return mapToResponse(user);
    }

    @Override
    public User getUserEntityById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
