package dev.martindotpy.sanipatitas.shared.breed.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindBreedPort {
    Uni<PageResult<BreedDto>> search(String search, int page, int size);

    Uni<BreedDto> findById(UUID id);
}
