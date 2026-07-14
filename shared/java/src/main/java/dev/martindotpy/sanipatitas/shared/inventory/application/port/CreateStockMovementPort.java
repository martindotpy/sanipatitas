package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockMovementPayload;
import io.smallrye.mutiny.Uni;

public interface CreateStockMovementPort {
    Uni<StockMovementDto> create(CreateStockMovementPayload payload);
}
