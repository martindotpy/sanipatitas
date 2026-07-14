package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import io.smallrye.mutiny.Uni;

public interface FindStockPort {
    Uni<StockDto> findByProductId(UUID productId);
    Uni<StockDto> findById(UUID id);
}
