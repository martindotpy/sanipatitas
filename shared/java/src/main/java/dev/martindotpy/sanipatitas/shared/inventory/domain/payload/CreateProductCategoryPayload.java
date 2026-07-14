package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreateProductCategoryPayload {
    @Nullable UUID getId();
    String getName();
    @Nullable String getDescription();
}
