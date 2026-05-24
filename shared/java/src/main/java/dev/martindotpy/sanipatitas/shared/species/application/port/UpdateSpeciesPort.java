package dev.martindotpy.sanipatitas.shared.species.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.UpdateSpeciesPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateSpeciesPort {
    Uni<SpeciesDto> update(UUID id, UpdateSpeciesPayload payload);
}
