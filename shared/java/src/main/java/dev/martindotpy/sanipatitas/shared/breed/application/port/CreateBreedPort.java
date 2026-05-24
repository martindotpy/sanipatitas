package dev.martindotpy.sanipatitas.shared.breed.application.port;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.CreateBreedPayload;
import io.smallrye.mutiny.Uni;

public interface CreateBreedPort {
    Uni<BreedDto> create(CreateBreedPayload payload);
}
