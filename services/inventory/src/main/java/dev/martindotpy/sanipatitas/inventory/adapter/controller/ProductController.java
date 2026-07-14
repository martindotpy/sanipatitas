package dev.martindotpy.sanipatitas.inventory.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import dev.martindotpy.sanipatitas.inventory.adapter.request.CreateProductRequest;
import dev.martindotpy.sanipatitas.inventory.adapter.request.UpdateProductRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateProductPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/product")
@RequiredArgsConstructor
public class ProductController {
    private final FindProductPort findProductPort;
    private final CreateProductPort createProductPort;
    private final UpdateProductPort updateProductPort;
    private final DeleteProductPort deleteProductPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<ProductDto>> findAll(
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findProductPort.findAll(page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Productos encontrados exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<ProductDto>> getById(@Uuid @RestPath UUID id) {
        return findProductPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Producto encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProductDto>> create(CreateProductRequest request) {
        return createProductPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Producto creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProductDto>> update(
            @Uuid @RestPath UUID id, UpdateProductRequest request) {
        return updateProductPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Producto actualizado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteProductPort.deleteById(id);
    }
}
