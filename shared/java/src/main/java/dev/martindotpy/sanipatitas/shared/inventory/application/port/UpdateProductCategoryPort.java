package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductCategoryPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateProductCategoryPort {
    Uni<ProductCategoryDto> update(UUID id, UpdateProductCategoryPayload payload);
}
