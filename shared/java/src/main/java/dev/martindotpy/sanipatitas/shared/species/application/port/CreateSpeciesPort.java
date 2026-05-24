package dev.martindotpy.sanipatitas.shared.species.application.port;

import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.CreateSpeciesPayload;
import io.smallrye.mutiny.Uni;

public interface CreateSpeciesPort {
    Uni<SpeciesDto> create(CreateSpeciesPayload payload);
}
