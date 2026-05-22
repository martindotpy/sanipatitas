package dev.martindotpy.sanipatitas.patient.adapter.controller;

import java.util.UUID;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.RestPath;

import dev.martindotpy.sanipatitas.patient.adapter.request.CreateSpeciesRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.patient.application.adapter.CreateSpeciesPort;
import dev.martindotpy.sanipatitas.shared.patient.application.adapter.FindSpeciesPort;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/species")
@RequiredArgsConstructor
public class SpeciesController {
    private final FindSpeciesPort findSpeciesPort;
    private final CreateSpeciesPort createSpeciesPort;

    @GET
    @Path("/{id}")
    public Uni<DataResponse<SpeciesDto>> getSpecies(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findSpeciesPort.findById(id)
                .map(dto -> DataResponse.<SpeciesDto>builder()
                        .data(dto)
                        .message("Especie encontrada exitosamente")
                        .build());
    }

    @POST
    public Uni<DataResponse<SpeciesDto>> createSpecies(CreateSpeciesRequest request) {
        return createSpeciesPort.create(request)
                .map(dto -> DataResponse.<SpeciesDto>builder()
                        .data(dto)
                        .message("Especie creada exitosamente")
                        .build());
    }
}
