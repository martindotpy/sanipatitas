package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateProductPort {
    Uni<ProductDto> update(UUID id, UpdateProductPayload payload);
}
