package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import java.math.BigDecimal;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface UpdateProductPayload {
    String getName();
    @Nullable String getCode();
    @Nullable String getDescription();
    @Nullable BigDecimal getPrice();
    @Nullable UUID getCategoryId();
    @Nullable UUID getSupplierId();
}
