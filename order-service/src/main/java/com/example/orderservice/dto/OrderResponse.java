package com.example.orderservice.dto;

import com.example.orderservice.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        LocalDateTime orderDate,
        OrderStatus status,
        BigDecimal totalAmount,
        String userId,
        List<OrderItemResponse> items) {
}
