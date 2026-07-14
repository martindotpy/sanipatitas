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

import dev.martindotpy.sanipatitas.inventory.adapter.request.CreateProductCategoryRequest;
import dev.martindotpy.sanipatitas.inventory.adapter.request.UpdateProductCategoryRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateProductCategoryPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/product-category")
@RequiredArgsConstructor
public class ProductCategoryController {
    private final FindProductCategoryPort findProductCategoryPort;
    private final CreateProductCategoryPort createProductCategoryPort;
    private final UpdateProductCategoryPort updateProductCategoryPort;
    private final DeleteProductCategoryPort deleteProductCategoryPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<ProductCategoryDto>> findAll(
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findProductCategoryPort.findAll(page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Categorias encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<ProductCategoryDto>> getById(@Uuid @RestPath UUID id) {
        return findProductCategoryPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Categoria encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProductCategoryDto>> create(CreateProductCategoryRequest request) {
        return createProductCategoryPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Categoria creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProductCategoryDto>> update(
            @Uuid @RestPath UUID id, UpdateProductCategoryRequest request) {
        return updateProductCategoryPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Categoria actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteProductCategoryPort.deleteById(id);
    }
}
