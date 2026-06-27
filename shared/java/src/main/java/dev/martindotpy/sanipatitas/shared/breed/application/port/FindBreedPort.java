package dev.martindotpy.sanipatitas.shared.breed.application.port;

import java.util.List;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindBreedPort {
    Uni<PageResult<BreedDto>> search(String search, int page, int size, @Nullable List<UUID> speciesIds);

    Uni<BreedDto> findById(UUID id);
}
