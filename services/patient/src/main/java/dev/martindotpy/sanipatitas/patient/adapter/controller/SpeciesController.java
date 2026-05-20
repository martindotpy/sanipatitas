package dev.martindotpy.sanipatitas.patient.adapter.controller;

import java.util.UUID;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.RestPath;

import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.patient.application.adapter.FindSpeciesPort;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/species")
@RequiredArgsConstructor
public class SpeciesController {
    private final FindSpeciesPort findSpeciesPort;

    @GET
    @Path("/{id}")
    public Uni<DataResponse<SpeciesDto>> getSpecies(@org.hibernate.validator.constraints.UUID @RestPath String id)
            throws NotFoundException {
        var uuid = UUID.fromString(id);

        return findSpeciesPort.findById(uuid)
                .map(dto -> DataResponse.<SpeciesDto>builder()
                        .data(dto)
                        .message("Especie encontrada exitosamente")
                        .build());
    }
}
