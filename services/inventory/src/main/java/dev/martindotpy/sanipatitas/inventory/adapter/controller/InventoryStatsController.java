package dev.martindotpy.sanipatitas.inventory.adapter.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.InventoryStatsDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindInventoryStatsPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/stats")
@RequiredArgsConstructor
public class InventoryStatsController {
    private final FindInventoryStatsPort findInventoryStatsPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<InventoryStatsDto>> getStats() {
        return findInventoryStatsPort.getStats()
                .map(DataResponse::from)
                .map(response -> response
                        .message("Estadísticas de inventario obtenidas exitosamente")
                        .build());
    }
}
