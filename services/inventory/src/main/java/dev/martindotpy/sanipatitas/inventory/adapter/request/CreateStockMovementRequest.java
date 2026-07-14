package dev.martindotpy.sanipatitas.inventory.adapter.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.MovementType;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockMovementPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStockMovementRequest implements CreateStockMovementPayload {
    @Nullable private UUID id;

    @NotNull
    private MovementType type;

    @Min(1)
    private int quantity;

    @Nullable private BigDecimal unitCost;
    @Nullable private BigDecimal unitPrice;
    @Nullable private BigDecimal discount;
    @Nullable private String reference;
    @Nullable private String notes;

    @NotNull
    private UUID stockId;
}
