package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductCategoryPayload;
import io.smallrye.mutiny.Uni;

public interface CreateProductCategoryPort {
    Uni<ProductCategoryDto> create(CreateProductCategoryPayload payload);
}
