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

import dev.martindotpy.sanipatitas.inventory.adapter.request.CreateSupplierRequest;
import dev.martindotpy.sanipatitas.inventory.adapter.request.UpdateSupplierRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateSupplierPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/inventory/supplier")
@RequiredArgsConstructor
public class SupplierController {
    private final FindSupplierPort findSupplierPort;
    private final CreateSupplierPort createSupplierPort;
    private final UpdateSupplierPort updateSupplierPort;
    private final DeleteSupplierPort deleteSupplierPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<SupplierDto>> findAll(
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findSupplierPort.findAll(page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Proveedores encontrados exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<SupplierDto>> getById(@Uuid @RestPath UUID id) {
        return findSupplierPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Proveedor encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<SupplierDto>> create(CreateSupplierRequest request) {
        return createSupplierPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Proveedor creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<SupplierDto>> update(
            @Uuid @RestPath UUID id, UpdateSupplierRequest request) {
        return updateSupplierPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Proveedor actualizado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteSupplierPort.deleteById(id);
    }
}
