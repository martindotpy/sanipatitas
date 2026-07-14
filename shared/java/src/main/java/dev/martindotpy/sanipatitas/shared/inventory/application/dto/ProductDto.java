package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductDto {
    @NotNull private final UUID id;
    @NotBlank private final String name;
    @Nullable private final String code;
    @Nullable private final String description;
    @Nullable private final BigDecimal price;
    @Nullable private final ProductCategoryDto category;
    @Nullable private final SupplierDto supplier;
    @NotNull private final LocalDateTime createdAt;
    @NotNull private final LocalDateTime updatedAt;
}
