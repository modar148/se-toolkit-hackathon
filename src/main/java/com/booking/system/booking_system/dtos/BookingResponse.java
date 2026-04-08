package com.booking.system.booking_system.dtos;

import com.booking.system.booking_system.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private Long eventId;
    private String eventTitle;
    private Status status;
    private List<SeatResponse> seats;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}
