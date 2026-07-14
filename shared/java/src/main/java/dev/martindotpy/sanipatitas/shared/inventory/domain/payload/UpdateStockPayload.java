package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface UpdateStockPayload {
    UUID getProductId();
    int getQuantity();
    @Nullable String getLocation();
    @Nullable Integer getMinStock();
}
