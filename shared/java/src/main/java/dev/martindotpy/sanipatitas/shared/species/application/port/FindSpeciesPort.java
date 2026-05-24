package dev.martindotpy.sanipatitas.shared.species.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import io.smallrye.mutiny.Uni;

public interface FindSpeciesPort {
    Uni<PageResult<SpeciesDto>> search(String search, int page, int size);

    Uni<SpeciesDto> findById(UUID id);
}
