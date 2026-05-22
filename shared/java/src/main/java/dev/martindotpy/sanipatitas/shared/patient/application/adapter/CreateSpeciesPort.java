package dev.martindotpy.sanipatitas.shared.patient.application.adapter;

import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreateSpeciesPayload;
import io.smallrye.mutiny.Uni;

public interface CreateSpeciesPort {
    Uni<SpeciesDto> create(CreateSpeciesPayload payload);
}
