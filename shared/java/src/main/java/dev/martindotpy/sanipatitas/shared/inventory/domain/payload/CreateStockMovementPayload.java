package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import java.math.BigDecimal;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.MovementType;

public interface CreateStockMovementPayload {
    @Nullable UUID getId();
    MovementType getType();
    int getQuantity();
    @Nullable BigDecimal getUnitCost();
    @Nullable BigDecimal getUnitPrice();
    @Nullable BigDecimal getDiscount();
    @Nullable String getReference();
    @Nullable String getNotes();
    UUID getStockId();
}
