package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductPayload;
import io.smallrye.mutiny.Uni;

public interface CreateProductPort {
    Uni<ProductDto> create(CreateProductPayload payload);
}
