package dev.martindotpy.sanipatitas.breed.adapter.controller;

import java.util.List;
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

import dev.martindotpy.sanipatitas.breed.adapter.request.CreateBreedRequest;
import dev.martindotpy.sanipatitas.breed.adapter.request.UpdateBreedRequest;
import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.application.port.CreateBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.application.port.DeleteBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.application.port.FindBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.application.port.UpdateBreedPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/breed")
@RequiredArgsConstructor
public class BreedController {
    private final FindBreedPort findBreedPort;
    private final CreateBreedPort createBreedPort;
    private final DeleteBreedPort deleteBreedPort;
    private final UpdateBreedPort updateBreedPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<BreedDto>> search(
            @RestQuery @Nullable String search,
            @RestQuery @Nullable List<UUID> speciesId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findBreedPort.search(search, page, size, speciesId)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Razas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<BreedDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findBreedPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Raza encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<BreedDto>> create(@Valid @NotNull CreateBreedRequest request) {
        return createBreedPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Raza creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<BreedDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateBreedRequest request) {
        return updateBreedPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Raza actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteBreedPort.deleteById(id);
    }
}
