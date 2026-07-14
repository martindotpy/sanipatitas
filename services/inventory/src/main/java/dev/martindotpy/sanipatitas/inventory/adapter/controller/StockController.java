package dev.martindotpy.sanipatitas.inventory.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import dev.martindotpy.sanipatitas.inventory.adapter.request.CreateStockRequest;
import dev.martindotpy.sanipatitas.inventory.adapter.request.UpdateStockRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateStockPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindStockPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateStockPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/stock")
@RequiredArgsConstructor
public class StockController {
    private final FindStockPort findStockPort;
    private final CreateStockPort createStockPort;
    private final UpdateStockPort updateStockPort;

    @GET
    @Path("/by-product")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<StockDto>> findByProductId(@RestQuery @Uuid UUID productId) {
        return findStockPort.findByProductId(productId)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Stock encontrado exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<StockDto>> getById(@Uuid @RestPath UUID id) {
        return findStockPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Stock encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<StockDto>> create(CreateStockRequest request) {
        return createStockPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Stock creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<StockDto>> update(
            @Uuid @RestPath UUID id, UpdateStockRequest request) {
        return updateStockPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Stock actualizado exitosamente")
                        .build());
    }
}
