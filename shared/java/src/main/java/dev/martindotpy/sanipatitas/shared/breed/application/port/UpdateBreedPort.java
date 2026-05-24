package dev.martindotpy.sanipatitas.shared.breed.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.UpdateBreedPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateBreedPort {
    Uni<BreedDto> update(UUID id, UpdateBreedPayload payload);
}
