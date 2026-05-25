package dev.martindotpy.sanipatitas.species.adapter.controller;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.application.port.CreateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.application.port.DeleteSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.application.port.FindSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.application.port.UpdateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.species.domain.error.SpeciesNotFoundException;
import dev.martindotpy.sanipatitas.species.adapter.request.CreateSpeciesRequest;
import dev.martindotpy.sanipatitas.species.adapter.request.UpdateSpeciesRequest;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/species")
@RequiredArgsConstructor
public class SpeciesController {
    private final FindSpeciesPort findSpeciesPort;
    private final CreateSpeciesPort createSpeciesPort;
    private final DeleteSpeciesPort deleteSpeciesPort;
    private final UpdateSpeciesPort updateSpeciesPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<SpeciesDto>> search(
            @RestQuery @Nullable String search,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findSpeciesPort.search(search, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Especies encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<SpeciesDto>> getById(
            @Uuid @RestPath UUID id) throws SpeciesNotFoundException {
        return findSpeciesPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Especie encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<SpeciesDto>> create(CreateSpeciesRequest request) {
        return createSpeciesPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Especie creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<SpeciesDto>> update(
            @Uuid @RestPath UUID id, UpdateSpeciesRequest request) throws SpeciesNotFoundException {
        return updateSpeciesPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Especie actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) throws SpeciesNotFoundException {
        return deleteSpeciesPort.deleteById(id);
    }
}
