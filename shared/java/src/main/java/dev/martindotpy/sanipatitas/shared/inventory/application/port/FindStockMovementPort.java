package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindStockMovementPort {
    Uni<PageResult<StockMovementDto>> findByStockId(UUID stockId, int page, int size);
}
