package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.InventoryStatsDto;
import io.smallrye.mutiny.Uni;

public interface FindInventoryStatsPort {
    Uni<InventoryStatsDto> getStats();
}
