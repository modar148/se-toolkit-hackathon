package com.booking.system.booking_system.controllers;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;

@RestController
public class SpaController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/venues",
            "/venues/{venueId:[0-9]+}",
            "/events",
            "/events/{eventId:[0-9]+}",
            "/my-bookings",
            "/admin",
            "/admin/venues",
            "/admin/venues/create",
            "/admin/venues/{venueId:[0-9]+}/edit",
            "/admin/venues/{venueId:[0-9]+}/seats",
            "/admin/events",
            "/admin/events/create",
            "/admin/events/{eventId:[0-9]+}/edit",
            "/admin/bookings"
    }, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> serveSpaIndex() {
        try {
            ClassPathResource resource = new ClassPathResource("static/index.html");
            String content = new String(resource.getInputStream().readAllBytes());
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error loading application");
        }
    }
}
