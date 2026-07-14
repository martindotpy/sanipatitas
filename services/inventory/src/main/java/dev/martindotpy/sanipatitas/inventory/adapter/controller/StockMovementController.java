package dev.martindotpy.sanipatitas.inventory.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import dev.martindotpy.sanipatitas.inventory.adapter.request.CreateStockMovementRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateStockMovementPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindStockMovementPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/stock-movement")
@RequiredArgsConstructor
public class StockMovementController {
    private final FindStockMovementPort findStockMovementPort;
    private final CreateStockMovementPort createStockMovementPort;

    @GET
    @Path("/by-stock/{stockId}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<StockMovementDto>> findByStockId(
            @Uuid @RestPath UUID stockId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findStockMovementPort.findByStockId(stockId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Movimientos encontrados exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<StockMovementDto>> create(CreateStockMovementRequest request) {
        return createStockMovementPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Movimiento registrado exitosamente")
                        .build());
    }
}
