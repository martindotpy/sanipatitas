package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import org.jspecify.annotations.Nullable;

public interface UpdateProductCategoryPayload {
    String getName();
    @Nullable String getDescription();
}
