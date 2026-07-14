package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateStockPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateStockPort {
    Uni<StockDto> update(UUID id, UpdateStockPayload payload);
}
