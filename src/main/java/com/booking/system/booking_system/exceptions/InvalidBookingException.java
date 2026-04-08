package com.booking.system.booking_system.exceptions;

public class InvalidBookingException extends RuntimeException {
    public InvalidBookingException(String message) {
        super(message);
    }

    public InvalidBookingException(String message, Throwable cause) {
        super(message, cause);
    }
}
