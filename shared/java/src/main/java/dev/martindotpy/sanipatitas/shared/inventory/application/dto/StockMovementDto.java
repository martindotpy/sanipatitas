package dev.martindotpy.sanipatitas.shared.inventory.application.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.MovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class StockMovementDto {
    @NotNull private final UUID id;
    @NotNull private final MovementType type;
    private final int quantity;
    @Nullable private final BigDecimal unitCost;
    @Nullable private final BigDecimal unitPrice;
    @Nullable private final BigDecimal discount;
    @Nullable private final String reference;
    @Nullable private final String notes;
    @NotNull private final StockDto stock;
    @NotNull private final OffsetDateTime createdAt;
}
