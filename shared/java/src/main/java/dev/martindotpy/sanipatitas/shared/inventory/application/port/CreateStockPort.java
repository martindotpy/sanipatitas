package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockPayload;
import io.smallrye.mutiny.Uni;

public interface CreateStockPort {
    Uni<StockDto> create(CreateStockPayload payload);
}
