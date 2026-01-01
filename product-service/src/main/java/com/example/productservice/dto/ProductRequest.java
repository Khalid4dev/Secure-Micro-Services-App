package com.example.productservice.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank(message = "Name is mandatory")
    String name,
    
    String description,
    
    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be positive")
    BigDecimal price,
    
    @NotNull(message = "Stock quantity is mandatory")
    @Min(value = 0, message = "Stock cannot be negative")
    Integer stockQuantity
) {}
