package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class StockDto {
    @NotNull private final UUID id;
    @NotNull private final ProductDto product;
    private final int quantity;
    @Nullable private final String location;
    @Nullable private final Integer minStock;
    @NotNull private final LocalDateTime createdAt;
    @NotNull private final LocalDateTime updatedAt;
}
