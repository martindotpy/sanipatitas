package dev.martindotpy.sanipatitas.client.adapter.controller;

import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.client.adapter.request.CreateClientRequest;
import dev.martindotpy.sanipatitas.client.adapter.request.UpdateClientRequest;
import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.application.port.CreateClientPort;
import dev.martindotpy.sanipatitas.shared.client.application.port.DeleteClientPort;
import dev.martindotpy.sanipatitas.shared.client.application.port.FindClientPort;
import dev.martindotpy.sanipatitas.shared.client.application.port.UpdateClientPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/client")
@RequiredArgsConstructor
public class ClientController {
    private final FindClientPort findClientPort;
    private final CreateClientPort createClientPort;
    private final DeleteClientPort deleteClientPort;
    private final UpdateClientPort updateClientPort;

    @GET
    @RolesAllowed({"admin", "worker"})
    public Uni<PageResponse<ClientDto>> search(
            @RestQuery @Nullable String search,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findClientPort.search(search, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Clientes encontrados exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<ClientDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findClientPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cliente encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<ClientDto>> create(@Valid @NotNull CreateClientRequest request) {
        return createClientPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cliente creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<ClientDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateClientRequest request) {
        return updateClientPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cliente actualizado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteClientPort.deleteById(id);
    }
}
